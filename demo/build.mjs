import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import { demoStages } from './vite.config.mjs'

const prepareSource = fileURLToPath(new URL('./prepare-renderer.mjs', import.meta.url))
const configFile = fileURLToPath(new URL('./vite.config.mjs', import.meta.url))

execFileSync(process.execPath, [prepareSource], { stdio: 'inherit' })
for (const mode of Object.keys(demoStages)) {
  await build({ configFile, mode })
}
