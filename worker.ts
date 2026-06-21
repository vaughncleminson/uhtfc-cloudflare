function setPayloadRuntimeGuards() {
  // In bundled Cloudflare worker runtimes, Payload's dependency checker can
  // crash while resolving import.meta.url. Disable it early, before imports.
  if (typeof process !== 'undefined' && process?.env) {
    process.env.PAYLOAD_DISABLE_DEPENDENCY_CHECKER = 'true'
  }
}

setPayloadRuntimeGuards()

let openNextHandlerPromise: Promise<ExportedHandler<CloudflareEnv>> | null = null

async function getOpenNextHandler() {
  if (!openNextHandlerPromise) {
    openNextHandlerPromise = import('./.open-next/worker.js').then(
      (mod) => mod.default as ExportedHandler<CloudflareEnv>,
    )
  }

  return openNextHandlerPromise
}

// Single-entry guard: prevents overlapping invocations from hammering D1
// simultaneously if the Worker is recycled and a new invocation fires.
let jobsRunning = false

async function runPayloadJobs() {
  if (jobsRunning) return
  jobsRunning = true

  try {
    setPayloadRuntimeGuards()

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
    const asError = err instanceof Error ? err : new Error(String(err))
    console.error('[scheduled] jobs run failed:', {
      message: asError.message,
      stack: asError.stack,
      cause: asError.cause,
    })
  } finally {
    jobsRunning = false
  }
}

export default {
  async fetch(request, env, ctx) {
    const handler = await getOpenNextHandler()
    return handler.fetch(request, env, ctx)
  },
  async scheduled(_controller, _env, ctx) {
    ctx.waitUntil(runPayloadJobs())
  },
} satisfies ExportedHandler<CloudflareEnv>
