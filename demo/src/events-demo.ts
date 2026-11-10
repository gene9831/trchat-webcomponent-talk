import '@angular/compiler'
import { Component, CUSTOM_ELEMENTS_SCHEMA, provideZonelessChangeDetection, signal } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import {
  useChatRuntime,
  type ChatModelFeatureValueChangePayload,
  type ChatUIOptions,
} from '@opentiny/tiny-robot-chat'
import '@opentiny/tiny-robot/dist/style.css'
import '@opentiny/tiny-robot-chat/dist/style.css'
import { ref, watch } from 'vue'
import { demoStorage } from './runtime'
import './register'
import './style.css'

const runtime = useChatRuntime({
  composer: { submitDisabled: ref(true) },
  conversation: {
    storage: demoStorage,
    autoSaveMessages: false,
    useMessageOptions: {
      initialMessages: [{ role: 'assistant', content: '打开「演示模型」，切换 Reasoning。' }],
    },
  },
  modelProviders: [{
    type: 'openai',
    apiUrl: new URL('./unused', window.location.href).href,
    models: [{
      id: 'demo-model',
      label: '演示模型',
      features: [{ key: 'reasoning', label: 'Reasoning', type: 'switch', defaultValue: false }],
    }],
  }],
})
runtime.actions.createConversation({ title: 'Reasoning 事件演示' })

function readReasoning() {
  return runtime.composer?.model?.featureValues?.value.reasoning === true
}

@Component({
  selector: 'chat-demo',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <dl class="event-readout">
      <div>
        <dt>Runtime 的 Reasoning</dt>
        <dd><output id="reasoning-value">{{ reasoning() ? '开启' : '关闭' }}</output></dd>
      </div>
      <div>
        <dt>Angular 收到的事件</dt>
        <dd>
          <output id="event-count">{{ receivedCount() }} 次</output>
          @if (lastDetail(); as detail) {
            <code id="event-detail">{{ detail.featureKey }} · {{ detail.previous }} → {{ detail.next }}</code>
          }
        </dd>
      </div>
    </dl>
    <!-- #region binding -->
    <tr-chat [runtime]="runtime" [ui]="ui"
      (model-feature-value-change)="onFeatureChange($event)"></tr-chat>
    <!-- #endregion binding -->
  `,
})
class ChatDemo {
  readonly runtime = runtime
  readonly ui: ChatUIOptions = {
    header: false,
    layout: { leftAside: false, rightAside: false },
  }

  readonly reasoning = signal(readReasoning())
  readonly receivedCount = signal(0)
  readonly lastDetail = signal<ChatModelFeatureValueChangePayload | null>(null)
  private readonly stopWatching = watch(readReasoning, value => this.reasoning.set(value))

  // #region handler
  onFeatureChange(event: Event) {
    const { detail } = event as CustomEvent<ChatModelFeatureValueChangePayload>
    this.lastDetail.set(detail)
    this.receivedCount.update(count => count + 1)
  }
  // #endregion handler

  ngOnDestroy() {
    this.stopWatching()
  }
}

bootstrapApplication(ChatDemo, { providers: [provideZonelessChangeDetection()] })
