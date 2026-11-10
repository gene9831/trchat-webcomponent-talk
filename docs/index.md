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
