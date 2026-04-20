// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from '@opennextjs/cloudflare/config'

export default defineCloudflareConfig({
  override: {
    wrapper: 'cloudflare',
  },
  middleware: {
    external: ['drizzle-kit', '@payloadcms/db-d1-sqlite', '@next/env'],
  },
})
