import '@angular/compiler'
import { Component, CUSTOM_ELEMENTS_SCHEMA, provideZonelessChangeDetection } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { useChatRuntime, type ChatUIOptions } from '@opentiny/tiny-robot-chat'
import '@opentiny/tiny-robot/dist/style.css'
import '@opentiny/tiny-robot-chat/dist/style.css'
import './register'
import './style.css'

const runtime = useChatRuntime({
  conversation: {
    autoSaveMessages: false,
    storage: {
      loadConversations: () => [],
      loadMessages: () => [],
      saveConversation: () => {},
      saveMessages: () => {},
    },
    useMessageOptions: {
      initialMessages: [{ role: 'assistant', content: '你好，我是 Angular 页面里的 TrChat。' }],
      responseProvider: async () => ({
        id: 'ce-minimal-reply',
        object: 'chat.completion',
        created: 0,
        model: 'local-demo',
        system_fingerprint: null,
        choices: [{
          index: 0,
          message: { role: 'assistant', content: '收到。这条回复来自本地模拟服务。' },
          delta: undefined,
          logprobs: null,
          finish_reason: 'stop',
        }],
      }),
    },
  },
})
runtime.actions.createConversation({ title: '最小 CE 封装' })

// #region mount
@Component({
  selector: 'chat-demo',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<tr-chat [runtime]="runtime" [ui]="ui"></tr-chat>',
})
class ChatDemo {
  readonly runtime = runtime
  readonly ui: ChatUIOptions = {
    header: false,
    layout: { leftAside: false, rightAside: false },
  }
}
// #endregion mount

bootstrapApplication(ChatDemo, { providers: [provideZonelessChangeDetection()] })
