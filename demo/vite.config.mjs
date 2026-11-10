import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export const demoStages = {
  'ce-minimal': { entry: 'index.html', directory: '01-ce-minimal' },
  'renderer-before': { entry: 'renderer.html', directory: '02-renderer-before' },
  'renderer-after': {
    entry: 'renderer.html',
    directory: '02-renderer-after',
    element: 'RendererTrChatElement.ce.vue',
  },
  'events-before': {
    entry: 'events.html',
    directory: '03-events-before',
    element: 'RendererTrChatElement.ce.vue',
  },
  'events-after': {
    entry: 'events.html',
    directory: '03-events-after',
    element: 'EventsTrChatElement.ce.vue',
  },
}

export default defineConfig(({ mode }) => {
  const stage = demoStages[mode] ?? demoStages['ce-minimal']

  return {
    root: fileURLToPath(new URL('.', import.meta.url)),
    base: './',
    plugins: [vue()],
    resolve: {
      alias: stage.element ? [{
        find: './TrChatElement.ce.vue',
        replacement: fileURLToPath(new URL(`./src/${stage.element}`, import.meta.url)),
      }] : [],
    },
    esbuild: { tsconfigRaw: { compilerOptions: { experimentalDecorators: true } } },
    build: {
      outDir: fileURLToPath(new URL(`../docs/public/demos/${stage.directory}`, import.meta.url)),
      emptyOutDir: true,
      rollupOptions: {
        input: fileURLToPath(new URL(stage.entry, import.meta.url)),
      },
    },
  }
})
