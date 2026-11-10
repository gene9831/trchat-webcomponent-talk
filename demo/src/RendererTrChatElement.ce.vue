<script setup lang="ts">
import TrChat from '../../.demo-source/renderer/packages/chat/src/Chat.vue'
import type { ChatMessageFooterRenderer, ChatRuntime, ChatUIOptions } from '../../.demo-source/renderer/packages/chat/src/types'

defineProps<{
  runtime?: ChatRuntime
  ui?: ChatUIOptions
  messageFooterRenderer?: ChatMessageFooterRenderer
}>()
</script>

<template>
  <TrChat v-if="runtime" :runtime="runtime" :ui="ui" :message-footer-renderer="messageFooterRenderer" />
</template>
