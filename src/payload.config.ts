import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { r2Storage } from '@payloadcms/storage-r2'
import fs from 'fs'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { GetPlatformProxyOptions } from 'wrangler'
import { Admins } from './admin/collections/Admins'
import { BookingHistory } from './admin/collections/BookingHistory'
import { Bookings } from './admin/collections/Bookings'
import { CatchReturns } from './admin/collections/CatchReturns'
import { EmailSubscribers } from './admin/collections/EmailSubscribers'
import { Festivals } from './admin/collections/Festivals'
import { Locations } from './admin/collections/Locations'
import { Media } from './admin/collections/Media'
import { Navigation } from './admin/collections/Navigation'
import { NewMemberships } from './admin/collections/NewMemberships'
import { Orders } from './admin/collections/Orders'
import { Pages } from './admin/collections/Pages'
import { Payments } from './admin/collections/Payments'
import { Settings } from './admin/collections/Settings'
import { Users } from './admin/collections/Users'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Define realpath safely
const realpath = (value: string) => {
  try {
    return fs.existsSync(value) ? fs.realpathSync(value) : undefined
  } catch (e) {
    return undefined
  }
}

// Check for CLI safely
const isCLI =
  typeof process !== 'undefined' &&
  Array.isArray(process.argv) &&
  process.argv.some((value) => {
    const pathValue = realpath(value)
    return pathValue && pathValue.endsWith(path.join('payload', 'bin.js'))
  })
const isProduction = process.env.NODE_ENV === 'production'

const cloudflare =
  isCLI || !isProduction
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })

export default buildConfig({
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  globals: [Settings, Navigation],
  collections: [
    Admins,
    Media,
    Orders,
    Payments,
    Bookings,
    BookingHistory,
    CatchReturns,
    NewMemberships,
    Festivals,
    Pages,
    Locations,
    Users,
    EmailSubscribers,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1, migrationDir: 'migrations', prodMigrations:migrations }),

  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2 as any,
      collections: { media: true },
    }),
  ],
})

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: isProduction,
      } satisfies GetPlatformProxyOptions),
  )
}
