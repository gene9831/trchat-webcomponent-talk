# TrChat Web Component 技术分享

第 1 步演示如何用 Vue 的 `defineCustomElement` 封装 TrChat 1.0，并从 Angular 绑定 Runtime、显示预置消息、发送消息和接收本地模拟回复。

第 2 步用同一份 Angular 源码构建两个独立页面，观察 `bubble-content-footer` 在最小封装和加入 Renderer 后的行为。

## 本地运行

使用 Node.js 22、pnpm、Git 和 tar。首次运行时，先缓存用于构建第 2 步的 TinyRobot 1.0 源码。

```sh
pnpm install
pnpm fetch:source
pnpm dev
```

打开 `http://localhost:5173/`。开发服务器启动前会构建 Angular 示例。需要生成静态分享站时运行 `pnpm build`。

- [分享正文](docs/index.md)
- [最小 Vue 封装](demo/src/TrChatElement.ce.vue)
- [Angular 宿主](demo/src/main.ts)

演示依赖公开发布的 TrChat 1.0，构建产物由 VitePress 同源提供。

第 2 步的修改前后共用 [Angular 入口](demo/src/renderer-demo.ts)。修复版从 TinyRobot 1.0 的固定提交构建，并应用 [bubble-content-footer 补丁](demo/patches/02-message-footer.patch)。构建脚本读取本地源码缓存。
