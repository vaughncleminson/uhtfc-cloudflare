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

async function runPayloadJobs(env: CloudflareEnv) {
  if (jobsRunning) return
  jobsRunning = true

  try {
    const handler = await getOpenNextHandler()

    const internalRequest = new Request('https://internal.local/api/internal/run-scheduled-jobs', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-cron-secret': env.PAYLOAD_SECRET,
      },
      body: JSON.stringify({
        queue: 'daily',
        limit: 10,
      }),
    })

    const response = await handler.fetch(
      internalRequest as unknown as Request<unknown, IncomingRequestCfProperties<unknown>>,
      env,
      {
        waitUntil: () => {},
        passThroughOnException: () => {},
      },
    )

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Internal scheduled route failed with ${response.status}: ${text}`)
    }

    const result = await response.json().catch((): null => null)
    console.log('[scheduled] jobs run ok:', result)
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
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(runPayloadJobs(env))
  },
} satisfies ExportedHandler<CloudflareEnv>
