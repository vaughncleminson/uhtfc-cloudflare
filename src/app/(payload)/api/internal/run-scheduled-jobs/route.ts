function setPayloadRuntimeGuards() {
  // Payload's dependency checker can crash in bundled worker routes when it
  // resolves import.meta.url too early.
  if (typeof process !== 'undefined' && process?.env) {
    process.env.PAYLOAD_DISABLE_DEPENDENCY_CHECKER = 'true'
  }
}

type ScheduledBody = {
  queue?: string
  limit?: number
}

export async function POST(request: Request) {
  setPayloadRuntimeGuards()

  const [{ default: config }, { getPayload }] = await Promise.all([
    import('@payload-config'),
    import('payload'),
  ])

  const expectedSecret = process.env.PAYLOAD_SECRET
  const providedSecret = request.headers.get('x-cron-secret')

  if (!expectedSecret || !providedSecret || providedSecret !== expectedSecret) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const body = (await request.json().catch(() => ({}))) as ScheduledBody
  const queue = body.queue || 'daily'
  const limit = typeof body.limit === 'number' ? body.limit : 10

  await payload.jobs.handleSchedules({ queue })
  await payload.jobs.run({
    queue,
    limit,
    silent: true,
  })

  return Response.json({ ok: true, queue, limit })
}
