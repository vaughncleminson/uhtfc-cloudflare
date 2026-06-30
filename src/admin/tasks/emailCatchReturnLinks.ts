import mailerSendTemplateAdapter from '@/admin/utils/mailerSendTemplateAdapter'
import config from '@payload-config'
import { getPayload, type TaskConfig } from 'payload'
import type { Booking as PayloadBooking } from '../../payload-types'
const mailsendTemplateID = process.env.MAILSEND_SHARED_WEBSITE_TEMPLATE_ID || 'z86org8onyn4ew13'

export const emailCatchReturnLinksTask: TaskConfig<'emailCatchReturnLinks'> = {
  // This task will send an email for each booking that occurs today
  // So each record in the Bookings collection with the date field == today will trigger an email to be sent
  // Bookings.first_name, Bookings.email, Bookings.date fields will be used in the email content
  // In the body of the email we will include a hyperlink to "Submit Catch Return" which will link to a page on the frontend
  // where the user can submit their catch return details
  // At the time the email is sent, a new record will be created in the CatchReturns collection
  // with the booking relationship field populated and the publicId field populated with a unique value
  // The hyperlink will include a query parameter with the CatchReturns publicId so that we can associate the catch return with the correct booking
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
      //create a new record in the CatchReturns collection with the booking relationship field populated and the publicId field populated
      const newCatchReturn = await req.payload.create({
        collection: 'catchReturns',
        data: {
          userId: booking.userId,
          locationName: booking.locationName || '',
          booking: booking.id,
          returnCompleted: false,
          publicId: crypto.randomUUID(),
          stats: {
            total: 0,
            averageLength: 0,
            largeFish: 0,
          },
        },
      })

      //send an email to the user with a link to submit their catch return details
      const cMessageTitle = `Your ${returnBookingLocation(booking)} Catch Return for ${returnBookingDate(booking)}`
      const cMessageBody = generateCatchReturnHTML(booking, newCatchReturn.publicId)
      const payload = await getPayload({ config })
      await mailerSendTemplateAdapter(
        mailsendTemplateID,
        cMessageTitle,
        [{ email: booking.email, name: booking.firstName }],
        [
          {
            email: booking.email,
            data: {
              recipientName: booking.firstName,
              emailSubject: cMessageTitle,
              messageTitle: cMessageTitle,
              messageBody: cMessageBody,
            },
          },
        ],
        payload.logger,
      )
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
}

function generateCatchReturnHTML(booking: PayloadBooking, catchReturnPublicId: string): string {
  const baseURL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'
  const catchReturnURL = `${baseURL}/catch-return?publicId=${catchReturnPublicId}`
  const locationLabel = returnBookingLocation(booking)
  const bookingDate = returnBookingDate(booking)

  return `
    <p>Thank you for your booking at ${locationLabel} on ${bookingDate}.</p>
    <br/>
    <p>Click the button below to submit your catch return:</p>
    <br/>
    <p><a href="${catchReturnURL}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Submit Catch Return</a></p>
    <br/>
    <p>If the button above does not work, please copy and paste the following link into your web browser:</p>
    <p>${catchReturnURL}</p>
    <br/>
    <p>We appreciate your cooperation in submitting your catch return details.</p>
    <br/>
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
