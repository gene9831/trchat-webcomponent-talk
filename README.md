# TrChat Web Component 技术分享

第 1 步演示如何用 Vue 的 `defineCustomElement` 封装 TrChat 1.0，并从 Angular 绑定 Runtime、显示预置消息、发送消息和接收本地模拟回复。

## 本地运行

使用 Node.js 22 和 pnpm。

```sh
pnpm install
pnpm dev
```

打开 `http://localhost:5173/`。开发服务器启动前会构建 Angular 示例。需要生成静态分享站时运行 `pnpm build`。

- [分享正文](docs/index.md)
- [最小 Vue 封装](demo/src/TrChatElement.ce.vue)
- [Angular 宿主](demo/src/main.ts)

演示依赖公开发布的 TrChat 1.0，构建产物由 VitePress 同源提供。
