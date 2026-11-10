<script setup lang="ts">
import { TrChat, type ChatRuntime, type ChatUIOptions } from '@opentiny/tiny-robot-chat'

defineProps<{
  runtime?: ChatRuntime
  ui?: ChatUIOptions
}>()
</script>

<template>
  <TrChat v-if="runtime" :runtime="runtime" :ui="ui" />
</template>
