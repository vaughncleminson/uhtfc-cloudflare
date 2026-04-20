import fs from 'node:fs'
import path from 'node:path'

const shimPath = path.join(
  process.cwd(),
  'node_modules',
  '@opennextjs',
  'cloudflare',
  'dist',
  'cli',
  'templates',
  'shims',
  'env.js',
)

if (!fs.existsSync(shimPath)) {
  console.warn(`[patch-opennext-env-shim] Shim file not found: ${shimPath}`)
  process.exit(0)
}

const current = fs.readFileSync(shimPath, 'utf8')

if (current.includes('export default')) {
  console.log('[patch-opennext-env-shim] Shim already patched')
  process.exit(0)
}

const patched = `${current.trimEnd()}\n\nexport default { loadEnvConfig }\n`
fs.writeFileSync(shimPath, patched, 'utf8')
console.log('[patch-opennext-env-shim] Added default export compatibility for @next/env shim')
