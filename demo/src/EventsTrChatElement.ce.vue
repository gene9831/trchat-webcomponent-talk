<script setup lang="ts">
import { useHost } from 'vue'
import TrChat from '../../.demo-source/renderer/packages/chat/src/Chat.vue'
import type {
  ChatMessageFooterRenderer,
  ChatModelFeatureValueChangePayload,
  ChatRuntime,
  ChatUIOptions,
} from '../../.demo-source/renderer/packages/chat/src/types'

defineProps<{
  runtime?: ChatRuntime
  ui?: ChatUIOptions
  messageFooterRenderer?: ChatMessageFooterRenderer
}>()

const host = useHost()

function forwardModelFeatureChange(payload: ChatModelFeatureValueChangePayload) {
  host?.dispatchEvent(new CustomEvent('model-feature-value-change', { detail: payload }))
}
</script>

<template>
  <TrChat
    v-if="runtime"
    :runtime="runtime"
    :ui="ui"
    :message-footer-renderer="messageFooterRenderer"
    @model-feature-value-change="forwardModelFeatureChange"
  />
</template>
