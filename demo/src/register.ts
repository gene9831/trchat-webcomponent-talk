import { defineCustomElement } from 'vue'
import TrChatElement from './TrChatElement.ce.vue'

customElements.define('tr-chat', defineCustomElement(TrChatElement, { shadowRoot: false }))
