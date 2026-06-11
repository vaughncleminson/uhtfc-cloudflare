import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { r2Storage } from '@payloadcms/storage-r2'
import fs from 'fs'
import path from 'path'
import { buildConfig, TaskConfig } from 'payload'
import { GetPlatformProxyOptions } from 'wrangler'

import { importExportPlugin } from '@payloadcms/plugin-import-export'
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
import { mailerSendAdapter } from './admin/utils/mailerSendAdapter'
import type { Booking as PayloadBooking } from './payload-types'

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
    importExportPlugin({
      collections: [
        {
          slug: 'previousUsers',
          import: {
            disableJobsQueue: true,
            limit: 2000, // Override global importLimit for this collection
          },
        },
      ],
      overrideImportCollection: ({ collection }) => ({
        ...collection,
        admin: {
          ...collection.admin,
          group: 'Data Management',
        },
      }),
      // see below for a list of available options
    }),

    r2Storage({
      bucket: cloudflare.env.R2 as any,
      collections: { media: true },
    }),
  ],
  // Scheduled jobs below
  jobs: {
    // Keep completed job records so run history is visible in admin
    deleteJobOnComplete: false,
    jobsCollectionOverrides: ({ defaultJobsCollection }) => {
      const updateLogField = (fields: any[] = []): any[] =>
        fields.map((field) => {
          if (field?.name === 'log') {
            return {
              ...field,
              label: 'Note',
              admin: {
                ...field.admin,
                components: {
                  ...field.admin?.components,
                  Cell: '@/admin/components/Jobs/noteCell#JobsNoteCell',
                },
              },
            }
          }

          if (field?.type === 'tabs' && Array.isArray(field.tabs)) {
            return {
              ...field,
              tabs: field.tabs.map((tab: any) => ({
                ...tab,
                fields: updateLogField(tab.fields || []),
              })),
            }
          }

          if (Array.isArray(field?.fields)) {
            return {
              ...field,
              fields: updateLogField(field.fields),
            }
          }

          return field
        })

      const fields = updateLogField(defaultJobsCollection.fields as any[])

      return {
        ...defaultJobsCollection,
        fields,
        admin: {
          ...defaultJobsCollection.admin,
          hidden: false,
          defaultColumns: ['taskSlug', 'queue', 'hasError', 'createdAt', 'log'],
          components: {
            ...defaultJobsCollection.admin?.components,
            beforeListTable: [
              ...(defaultJobsCollection.admin?.components?.beforeListTable || []),
              '@/admin/components/Jobs/triggerNow#TriggerCatchReturnJobButton',
              '@/admin/components/Jobs/quickFilters#JobsQuickFilters',
            ],
          },
        },
      }
    },
    tasks: [
      {
        // This task will send an email for each booking that occurs today
        // So each record in the Bookings collection with the date field == today will trigger an email to be sent
        // Bookings.first_name, Bookings.email, Bookings.date fields will be used in the email content
        // In the body of the email we will include a hyperlink to "Submit Catch Return" which will link to a page on the frontend
        // where the user can submit their catch return details
        // The hyperlink will include a query parameter with the booking ID so that we can associate the catch return with the correct booking
        slug: 'emailCatchReturnLinks',

        // This automatically queues the task every day at 8 AM
        schedule: [
          {
            cron: '0 8 * * *', // Every day at 8:00 AM
            queue: 'daily', // Queue to add the job to
          },
        ],

        inputSchema: [
          {
            name: 'date',
            type: 'date',
          },
        ],

        handler: async ({ req, input }) => {
          const jobName = 'emailCatchReturnLinks'
          const ranAt = new Date().toISOString()
          console.log(`Job ${jobName} started at ${ranAt}`)
          console.log('input:', input)
          const normalizedInputDate = input.date ? new Date(input.date) : new Date()
          const dateForQuery = Number.isNaN(normalizedInputDate.getTime())
            ? new Date().toISOString().slice(0, 10)
            : normalizedInputDate.toISOString().slice(0, 10)
          const startOfDayUTC = `${dateForQuery}T00:00:00.000Z`
          const nextDay = new Date(startOfDayUTC)
          nextDay.setUTCDate(nextDay.getUTCDate() + 1)
          const startOfNextDayUTC = nextDay.toISOString()
          console.log('Date range:', { startOfDayUTC, startOfNextDayUTC })

          // Send daily catch return emails
          //we send an email to each user with a booking for the current day
          // with a link to submit their catch return details
          const bookingsToday = await req.payload.find({
            collection: 'bookings',
            where: {
              and: [
                { date: { greater_than_equal: startOfDayUTC } },
                { date: { less_than: startOfNextDayUTC } },
              ],
            },
          })

          const catchReturnsToSend = bookingsToday.docs.length

          for (const booking of bookingsToday.docs) {
            await req.payload.sendEmail({
              to: booking.email,
              subject: `Your ${returnBookingLocation(booking)} Catch Return for ${returnBookingDate(booking)}`,
              html: generateCatchReturnHTML(booking),
            })
          }

          //add a note to the job log with the number of emails sent and the date the job ran
          const note = `${jobName} ran. Catch returns: ${catchReturnsToSend}`
          req.payload.logger.info(note)

          return {
            output: {
              jobName,
              ranAt,
              note,
              catchReturnsToSend,
              emailsSent: bookingsToday.docs.length,
              date: dateForQuery,
            },
          }
        },
      } as TaskConfig<'emailCatchReturnLinks'>,
    ],

    // On Cloudflare Workers, scheduled jobs are triggered by the worker's
    // scheduled() handler instead of Payload's in-process autoRun cron.
    // See https://developers.cloudflare.com/workers/configuration/cron-triggers/
  },
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

function generateCatchReturnHTML(booking: PayloadBooking) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const catchReturnURL = `${baseURL}/submit-catch-return?bookingId=${booking.id}`
  const locationLabel = returnBookingLocation(booking)
  const bookingDate = returnBookingDate(booking)

  return `
    <p>Hi ${booking.firstName},</p>
    <p>Thank you for your booking at ${locationLabel} on ${bookingDate}.</p>
    <p>Please submit your catch return details by clicking the link below:</p>
    <p><a href="${catchReturnURL}">Submit Catch Return</a></p>
    <p>Best regards,<br/>The Underberg-Himeville Trout Fishing Club</p>
  `
}

function returnBookingDate(booking: PayloadBooking): string {
  return booking.date ? booking.date.slice(0, 10) : 'Unknown date'
}

function returnBookingLocation(booking: PayloadBooking): string {
  if (typeof booking.location === 'object' && booking.location !== null) {
    return booking.location.title || 'Unknown location'
  }
  return `${booking.location}`
}
