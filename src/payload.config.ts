import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { r2Storage } from '@payloadcms/storage-r2'
import fs from 'fs'
import path from 'path'
import { buildConfig } from 'payload'
import { GetPlatformProxyOptions } from 'wrangler'

import { migrations } from 'migrations'
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
import { PreviousUsers } from './admin/collections/PreviousUsers'
import { Settings } from './admin/collections/Settings'
import { Users } from './admin/collections/Users'
import { jobs } from './admin/jobs'
import { mailerSendAdapter } from './admin/utils/mailerSendAdapter'

const dirname = path.resolve(process.cwd(), 'src')

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

// In development, let Payload infer the origin from the incoming request.
// Forcing a production URL here can cause admin server-actions to lose auth context.
const payloadServerURL = isProduction
  ? process.env.PAYLOAD_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || ''
  : undefined

const skipRemoteCloudflare = process.env.SKIP_REMOTE_CLOUDFLARE === 'true'

const cloudflare = await getCloudflareContextSafe()
const mailerSendToken = process.env.MAILSEND_TOKEN || process.env.NEXT_PUBLIC_MAILSEND_TOKEN || ''

export default buildConfig({
  admin: {
    user: Admins.slug,
    autoRefresh: true,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: ['@/admin/components/BuildInfo/AdminBuildInfo#AdminBuildInfo'],
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
    Bookings,
    BookingHistory,
    CatchReturns,
    EmailSubscribers,
    Festivals,
    Locations,
    Media,
    NewMemberships,
    Orders,
    Payments,
    Pages,
    Users,
    PreviousUsers,
  ],
  editor: lexicalEditor(),
  email: mailerSendAdapter({
    apiKey: mailerSendToken,
    defaultFromAddress: process.env.MAILSEND_FROM_EMAIL || 'no-reply@uhtfc.org.za',
    defaultFromName: process.env.MAILSEND_FROM_NAME || 'The Underberg-Himeville Trout Fishing Club',
    defaultReplyToAddress: process.env.MAILSEND_REPLY_TO_EMAIL,
    defaultReplyToName:
      process.env.MAILSEND_REPLY_TO_NAME || 'The Underberg-Himeville Trout Fishing Club',
  }),
  endpoints: [
    {
      path: '/jobs/trigger-catch-return-links',
      method: 'post',
      handler: async (req) => {
        if (!req.user || req.user.collection !== 'admins') {
          return Response.json(
            {
              errors: [{ message: 'You are not allowed to perform this action.' }],
            },
            { status: 401 },
          )
        }

        const now = new Date().toISOString()

        await req.payload.jobs.queue({
          task: 'emailCatchReturnLinks',
          queue: 'daily',
          input: { date: now },
          req,
          overrideAccess: true,
        })

        await req.payload.jobs.run({
          queue: 'daily',
          req,
          overrideAccess: true,
        })

        return Response.json({
          message: 'emailCatchReturnLinks queued and run successfully.',
        })
      },
    },
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: payloadServerURL,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({
    binding: cloudflare.env.D1,
    prodMigrations: migrations,
  }),
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2 as any,
      collections: { media: true },
    }),
    importExportPlugin({
      collections: [{ slug: 'previousUsers' }],
      overrideImportCollection: ({ collection }) => ({
        ...collection,
        admin: {
          ...collection.admin,
          group: 'Data Management',
        },
      }),
    }),
  ],
  jobs,
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
async function getCloudflareContextSafe() {
  // In production, skip wrangler entirely
  if (process.env.CF_DEPLOYMENT === 'true' || process.env.NODE_ENV === 'production') {
    return getCloudflareContext({ async: true })
  }

  // Dev/CLI only
  try {
    return await getCloudflareContextFromWrangler()
  } catch {
    return getCloudflareContext({ async: true })
  }
}
