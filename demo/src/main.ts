import '@angular/compiler'
import { Component, CUSTOM_ELEMENTS_SCHEMA, provideZonelessChangeDetection } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import type { ChatUIOptions } from '@opentiny/tiny-robot-chat'
import { createDemoRuntime } from './runtime'
import '@opentiny/tiny-robot/dist/style.css'
import '@opentiny/tiny-robot-chat/dist/style.css'
import './register'
import './style.css'

const runtime = createDemoRuntime('你好，我是 Angular 页面里的 TrChat。', '最小 CE 封装')

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
