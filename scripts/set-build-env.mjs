/**
 * Resolves the current git branch and short SHA, then writes them to
 * process.env so subsequent commands in the same shell see them.
 *
 * Resolution order for branch:
 *   1. GITHUB_REF_NAME  – set by GitHub Actions
 *   2. GITHUB_HEAD_REF  – set on pull-request builds
 *   3. git name-rev     – resolves a detached HEAD to its branch name via the
 *                         remote tracking ref (e.g. "remotes/origin/main" → "main")
 *   4. git symbolic-ref – works on a normal local checkout
 *   5. UNKNOWN          – fallback
 *
 * Usage in package.json scripts (node evaluates $() before execvp):
 *   "build": "node scripts/set-build-env.mjs && cross-env ..."
 *
 * But since we can't export vars to the parent shell from a child process,
 * this script instead writes a tiny .env.build file that next.config.ts loads.
 */

import { execSync } from 'child_process'
import { writeFileSync } from 'fs'

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
  } catch {
    return ''
  }
}

const branch =
  process.env.GITHUB_REF_NAME ||
  process.env.GITHUB_HEAD_REF ||
  // Detached HEAD: find which remote branch contains this commit
  (() => {
    const nameRev = run('git name-rev --name-only HEAD')
    // Strip "remotes/origin/" prefix, "~N" suffix, and ignore "undefined"
    const cleaned = nameRev.replace(/^remotes\/[^/]+\//, '').replace(/~\d+$/, '')
    return cleaned && cleaned !== 'undefined' ? cleaned : ''
  })() ||
  run('git symbolic-ref --short HEAD') ||
  'UNKNOWN'

const sha = run('git rev-parse --short HEAD') || ''

const content = `NEXT_PUBLIC_GIT_BRANCH=${branch}\nNEXT_PUBLIC_GIT_SHA=${sha}\n`
writeFileSync('.env.build', content)
console.log(`[set-build-env] branch=${branch} sha=${sha}`)
