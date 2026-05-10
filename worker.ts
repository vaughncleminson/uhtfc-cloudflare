// @ts-ignore .open-next/worker.js is generated at build time
import { default as handler } from './.open-next/worker.js'

// Single-entry guard: prevents overlapping invocations from hammering D1
// simultaneously if the Worker is recycled and a new invocation fires.
let jobsRunning = false

async function runPayloadJobs() {
  if (jobsRunning) return
  jobsRunning = true

  try {
    const [{ getPayload }, { default: config }] = await Promise.all([
      import('payload'),
      import('./src/payload.config'),
    ])

    const payload = await getPayload({ config })

    await payload.jobs.handleSchedules({
      queue: 'daily',
    })

    await payload.jobs.run({
      limit: 10,
      queue: 'daily',
      silent: true,
    })
  } catch (err) {
    // D1 busy/locked errors must not crash the worker or leave the guard set.
    // Log and move on — the next scheduled invocation will retry.
    console.error('[scheduled] jobs run failed:', err)
  } finally {
    jobsRunning = false
  }
}

export default {
  fetch: handler.fetch,
  async scheduled(_controller, _env, ctx) {
    ctx.waitUntil(runPayloadJobs())
  },
} satisfies ExportedHandler<CloudflareEnv>
