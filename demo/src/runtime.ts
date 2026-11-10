import { useChatRuntime } from '@opentiny/tiny-robot-chat'
import type { ConversationStorageStrategy } from '@opentiny/tiny-robot-kit'

export const demoStorage: ConversationStorageStrategy = {
  loadConversations: () => [],
  loadMessages: () => [],
  saveConversation: () => {},
  saveMessages: () => {},
}

export function createDemoRuntime(initialReply: string, title: string) {
  const runtime = useChatRuntime({
    conversation: {
      autoSaveMessages: false,
      storage: demoStorage,
      useMessageOptions: {
        initialMessages: [{ role: 'assistant', content: initialReply }],
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
  runtime.actions.createConversation({ title })
  return runtime
}
