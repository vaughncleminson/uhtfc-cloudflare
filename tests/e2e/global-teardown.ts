import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(dirname, '../..')

export default function globalTeardown() {
  execFileSync(
    path.join(repoRoot, 'node_modules/.bin/vite-node'),
    ['--config', 'vitest.config.mts', path.join(dirname, 'teardown-dashboard-location.ts')],
    { cwd: repoRoot, stdio: 'inherit' },
  )
}
