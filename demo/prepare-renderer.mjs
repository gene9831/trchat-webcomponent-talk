import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const revision = '088a52b5ecfc96d1566592b338139ddceb16cfd7'
const project = fileURLToPath(new URL('../', import.meta.url))
const cache = join(project, '.demo-source')
const archive = join(cache, `tiny-robot-${revision}.tar.gz`)
const destination = join(cache, 'renderer')
const patch = join(project, 'demo/patches/02-message-footer.patch')

if (process.argv.includes('--fetch')) {
  if (!existsSync(archive)) {
    mkdirSync(cache, { recursive: true })
    const response = await fetch(`https://codeload.github.com/opentiny/tiny-robot/tar.gz/${revision}`)
    if (!response.ok) throw new Error(`获取 TinyRobot 1.0 源码失败（HTTP ${response.status}）`)
    const download = `${archive}.${process.pid}.download`
    try {
      writeFileSync(download, Buffer.from(await response.arrayBuffer()))
      renameSync(download, archive)
    } finally {
      rmSync(download, { force: true })
    }
  }
  console.log(`TinyRobot 1.0 源码已缓存（${revision.slice(0, 9)}）`)
} else {
  if (!existsSync(archive)) throw new Error('缺少 TinyRobot 1.0 源码缓存，请先运行 pnpm fetch:source。')

  const staging = mkdtempSync(join(cache, 'renderer-'))
  try {
    execFileSync('tar', [
      '-xzf', archive, '-C', staging, '--strip-components=1', `tiny-robot-${revision}/packages/chat/src`,
    ], { stdio: 'inherit' })
    execFileSync('git', ['apply', '--directory', relative(project, staging), patch], { cwd: project, stdio: 'inherit' })
    rmSync(destination, { recursive: true, force: true })
    renameSync(staging, destination)
  } finally {
    rmSync(staging, { recursive: true, force: true })
  }
}
