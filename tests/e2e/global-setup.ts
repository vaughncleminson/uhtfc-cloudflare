import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(dirname, '../..')

// Playwright's own TS loader can't resolve Next.js's package exports (e.g. `next/cache`,
// pulled in transitively via the Locations collection hooks), so the actual Payload seeding
// runs in a separate `vite-node` process, which resolves them the same way Vitest does.
export default function globalSetup() {
  execFileSync(
    path.join(repoRoot, 'node_modules/.bin/vite-node'),
    ['--config', 'vitest.config.mts', path.join(dirname, 'seed-dashboard-location.ts')],
    { cwd: repoRoot, stdio: 'inherit' },
  )
}
