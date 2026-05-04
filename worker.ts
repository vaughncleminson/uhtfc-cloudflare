// @ts-ignore .open-next/worker.js is generated at build time
import { default as handler } from './.open-next/worker.js'
import config from './src/payload.config'
import { getPayload } from 'payload'

async function runPayloadJobs() {
  const payload = await getPayload({ config })

  await payload.jobs.handleSchedules({
    queue: 'daily',
  })

  await payload.jobs.run({
    limit: 10,
    queue: 'daily',
    silent: true,
  })
}

export default {
  fetch: handler.fetch,
  async scheduled(_controller, _env, ctx) {
    ctx.waitUntil(runPayloadJobs())
  },
} satisfies ExportedHandler<CloudflareEnv>