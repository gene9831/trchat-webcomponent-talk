import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: './',
  plugins: [vue()],
  esbuild: { tsconfigRaw: { compilerOptions: { experimentalDecorators: true } } },
  build: {
    outDir: fileURLToPath(new URL('../docs/public/demos/01-ce-minimal', import.meta.url)),
    emptyOutDir: true,
  },
})
