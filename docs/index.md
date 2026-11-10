# 从 Vue 到 Angular：TrChat Web Component 的跨框架验证

从已发布的 TrChat 1.0 出发，逐步把 Vue 组件封装成 Web Component，并在 Angular 中验证每一步。

## 第 1 步 · 最小 CE 封装

先验证一件事：Angular 能挂载 TrChat，显示消息，并通过现有 Runtime 发送和接收回复。

### 包一层 Vue 组件

**`TrChatElement.ce.vue`**

<<< ../demo/src/TrChatElement.ce.vue

::: info Notes
封装层为 `<tr-chat>` 定义宿主入口。原生 `TrChat` 初始化时需要 `runtime`，因此用 `v-if` 避免宿主还没传入它时就创建组件。

`.ce.vue` 是 Vite 的 Vue 插件识别的命名约定，会将该文件的 `<style>` 内联，供 Shadow DOM 使用。本例使用 `shadowRoot: false`，由 Angular 入口加载样式。 [Vue 文档](https://vuejs.org/guide/extras/web-components#sfc-as-custom-element)
:::

### 注册浏览器元素

用 Vue 的 `defineCustomElement` 生成构造器，再用浏览器的 `customElements.define` 注册 `<tr-chat>`。

<<< ../demo/src/register.ts

### 在 Angular 中挂载

standalone 组件声明 `CUSTOM_ELEMENTS_SCHEMA`。Angular 用 property binding 把 Runtime 和界面配置交给 `<tr-chat>`。

<<< ../demo/src/main.ts#mount

**实际操作。** 先看预置消息，再输入一句话并发送。下方是真实的 Angular 应用，Runtime 使用本地模拟回复。

<iframe title="最小 CE 封装的 Angular 演示" src="demos/01-ce-minimal/index.html" style="width: 100%; height: 380px; border: 1px solid var(--vp-c-divider); border-radius: 8px;"></iframe>

## 第 2 步 · 从 Vue scoped slot 到 DOM Renderer

### 给回复加一个复制按钮

我们想在 AI 回复的气泡正文下方加一个「复制」按钮。在原生 Vue `<TrChat>` 中，用 **`#bubble-content-footer`** scoped slot 自定义这块区域，TrChat 会通过 `messages` 传入当前消息。

```vue
<TrChat :runtime="runtime">
  <template #bubble-content-footer="{ messages, role }">
    <button v-if="role === 'assistant'" type="button" @click="copyReply(messages)">
      复制
    </button>
  </template>
</TrChat>
```

接下来把同一个 Vue slot 写法放进 Angular 模板，看看按钮能否出现在 `bubble-content-footer` 对应的位置。

<<< ../demo/src/renderer-demo.ts#vue-slot{html}

<iframe title="修改前的 Angular bubble-content-footer 示例" src="demos/02-renderer-before/renderer.html?example=vue-slot" loading="lazy" style="width: 100%; height: 230px; border: 1px solid var(--vp-c-divider); border-radius: 8px;"></iframe>

::: info Notes
回复显示了，`bubble-content-footer` 对应的位置没有出现「复制」按钮。`v-slot` 由 Vue 的模板编译器处理，它会把插槽内容编译成一个能接收 `messages` 的函数。这里的模板由 Angular 编译，里面的 `<template v-slot:…>` 没有变成 Vue scoped slot，TrChat 自然没有收到这个函数。 [Vue 的 scoped slot](https://vuejs.org/guide/components/slots#scoped-slots) · [Vue 自定义元素的 slot 支持](https://vuejs.org/guide/extras/web-components#slots)
:::

### 修改方案

在渲染 `bubble-content-footer` 时，TrChat 把当前消息传给 Renderer，再将它返回的 DOM 节点挂到这个位置。

#### 改造 TrChat 的 `bubble-content-footer`

**`Chat.vue`** 在 `defineProps` 中新增可选 prop `messageFooterRenderer?: ChatMessageFooterRenderer`，再把它传给 `ChatUI.vue`。下面是新增的转发绑定。

```vue
<ChatUI :message-footer-renderer="props.messageFooterRenderer" />
```

**`ChatUI.vue`** 在 `bubble-content-footer` 中取得当前消息的上下文。Vue 调用方提供了 scoped slot 时优先用它，其余情况交给 `MessageFooterOutlet` 调用 Renderer。

<<< ../.demo-source/renderer/packages/chat/src/ChatUI.vue#message-footer

**`MessageFooterOutlet.vue`** 把 Renderer 返回的按钮挂到 `bubble-content-footer` 的渲染位置。回复变化或组件卸载时，它会移除旧按钮，并用 `AbortSignal` 清理点击监听，避免点旧按钮时复制到上一条回复。

<<< ../.demo-source/renderer/packages/chat/src/ui/renderers/MessageFooterOutlet.vue

#### 通过 CE 封装暴露属性

**`RendererTrChatElement.ce.vue`** 将 `messageFooterRenderer` 声明为 `<tr-chat>` 的 JavaScript property，再转发给 TrChat。

<<< ../demo/src/RendererTrChatElement.ce.vue

### 在 Angular 中使用并复验

Angular 把创建按钮的函数绑定到 `messageFooterRenderer`。点击时，函数把从 TrChat 收到的回复原文写入剪贴板，按钮显示「已复制」。

<<< ../demo/src/renderer-demo.ts#binding{html}

<<< ../demo/src/renderer-demo.ts#renderer

沿用同一个 Angular 宿主和同一条预置回复，试着点击下方的「复制」。

<iframe title="修复后的 Angular bubble-content-footer 示例" src="demos/02-renderer-after/renderer.html" loading="lazy" style="width: 100%; height: 230px; border: 1px solid var(--vp-c-divider); border-radius: 8px;"></iframe>

### 扩展到多个 scoped slot

本章用 `messageFooterRenderer` 演示 `bubble-content-footer` 的接入。如果以后要开放多个 scoped slot，可以用一个 `renderers` prop，按区域名称提供回调，例如 `renderers['bubble-content-footer']` 和 `renderers['layout-header']`。

每个要开放的区域仍需在自己的渲染位置接入 Renderer，并传入对应的上下文。`bubble-content-footer` 传当前消息，`layout-header` 传标题等数据。各处可以共用同一个 `RendererOutlet` 实现，由它负责 DOM 的挂载和清理。
