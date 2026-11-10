import '@angular/compiler'
import { Component, CUSTOM_ELEMENTS_SCHEMA, provideZonelessChangeDetection } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import type { ChatUIOptions } from '@opentiny/tiny-robot-chat'
import '@opentiny/tiny-robot/dist/style.css'
import '@opentiny/tiny-robot-chat/dist/style.css'
import type { ChatMessageFooterRenderer } from '../../.demo-source/renderer/packages/chat/src/types'
import { createDemoRuntime } from './runtime'
import './register'
import './style.css'

const vueSlotTemplate = `
  <!-- #region vue-slot -->
  <tr-chat class="footer-demo" [runtime]="runtime" [ui]="ui">
    <template v-slot:bubble-content-footer="{ messages }">
      <button type="button">复制</button>
    </template>
  </tr-chat>
  <!-- #endregion vue-slot -->
`

const rendererTemplate = `
  <!-- #region binding -->
  <tr-chat class="footer-demo" [runtime]="runtime" [ui]="ui"
    [messageFooterRenderer]="renderMessageFooter"></tr-chat>
  <!-- #endregion binding -->
`

@Component({
  selector: 'chat-demo',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: import.meta.env.MODE === 'renderer-before' ? vueSlotTemplate : rendererTemplate,
})
class ChatDemo {
  readonly runtime = createDemoRuntime('这是一条用于演示复制功能的回复。', 'bubble-content-footer')
  readonly ui: ChatUIOptions = {
    header: false,
    sender: false,
    layout: { leftAside: false, rightAside: false },
  }

  // #region renderer
  readonly renderMessageFooter: ChatMessageFooterRenderer = ({ role, messages }, signal) => {
    if (role !== 'assistant') return null

    const text = messages.map(({ content }) => typeof content === 'string' ? content : '').join('\n')
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'copy-button'
    button.textContent = '复制'
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(text)
        button.textContent = '已复制'
      } catch {
        button.textContent = '复制失败'
      }
    }, { signal })
    return button
  }
  // #endregion renderer
}

bootstrapApplication(ChatDemo, { providers: [provideZonelessChangeDetection()] })
