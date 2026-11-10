import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const rendererDemo = mode === 'renderer-before' || mode === 'renderer-after'
  const directory = rendererDemo ? `02-${mode}` : '01-ce-minimal'

  return {
    root: fileURLToPath(new URL('.', import.meta.url)),
    base: './',
    plugins: [vue()],
    resolve: {
      alias: mode === 'renderer-after' ? [{
        find: './TrChatElement.ce.vue',
        replacement: fileURLToPath(new URL('./src/RendererTrChatElement.ce.vue', import.meta.url)),
      }] : [],
    },
    esbuild: { tsconfigRaw: { compilerOptions: { experimentalDecorators: true } } },
    build: {
      outDir: fileURLToPath(new URL(`../docs/public/demos/${directory}`, import.meta.url)),
      emptyOutDir: true,
      rollupOptions: {
        input: fileURLToPath(new URL(rendererDemo ? './renderer.html' : './index.html', import.meta.url)),
      },
    },
  }
})
