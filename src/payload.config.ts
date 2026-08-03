import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { r2Storage } from '@payloadcms/storage-r2'
import path from 'path'
import { buildConfig } from 'payload'
import { GetPlatformProxyOptions } from 'wrangler'

import { migrations } from 'migrations'
import { Admins } from './admin/collections/Admins'
import { BookingHistory } from './admin/collections/BookingHistory'
import { Bookings } from './admin/collections/Bookings'
import { CatchReturns } from './admin/collections/CatchReturns'
import { EmailAuditLogs } from './admin/collections/EmailAuditLogs'
import { EmailSubscribers } from './admin/collections/EmailSubscribers'
import { FestivalEntries } from './admin/collections/FestivalEntries'
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

const cwd =
  typeof process !== 'undefined' && typeof process.cwd === 'function' ? process.cwd() : undefined
const dirname = path.resolve(typeof cwd === 'string' && cwd.length > 0 ? cwd : '.', 'src')
const isProduction = process.env.NODE_ENV === 'production'
const d1AutoPushMigrations = parseBooleanEnv(process.env.D1_AUTO_PUSH_MIGRATIONS, true)
const configuredServerURL = process.env.PAYLOAD_PUBLIC_SERVER_URL?.trim()

const productionOrigins = ['https://uhtfc.org.za', 'https://www.uhtfc.org.za']
const developmentOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000']
const allowedOrigins = isProduction
  ? productionOrigins
  : [...productionOrigins, ...developmentOrigins]

// In development, let Payload infer the origin from the incoming request.
// Forcing a production URL here can cause admin server-actions to lose auth context.

const cloudflare = await getCloudflareContextSafe()
const mailerSendToken = process.env.MAILSEND_TOKEN || ''

export default buildConfig({
  // Keep serverURL unset in development so admin server actions use the incoming request origin.
  // This preserves auth cookies for calls such as /api/payload-preferences.
  serverURL: isProduction ? configuredServerURL || 'https://uhtfc.org.za' : configuredServerURL,
  csrf: allowedOrigins,
  cors: allowedOrigins,
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
    EmailAuditLogs,
    EmailSubscribers,
    Festivals,
    FestivalEntries,
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
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({
    binding: cloudflare.env.D1,
    prodMigrations: migrations,
    push: d1AutoPushMigrations,
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
        remoteBindings: isProduction, // set to true if you want to load R2 bucket photos on dev,
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

function parseBooleanEnv(value: string | undefined, defaultValue: boolean): boolean {
  if (value == null || value.trim() === '') {
    return defaultValue
  }

  const normalized = value.trim().toLowerCase()

  if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
    return true
  }

  if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
    return false
  }

  return defaultValue
}
