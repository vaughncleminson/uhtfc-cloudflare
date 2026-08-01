import mailerSendTemplateAdapter from '@/admin/utils/mailerSendTemplateAdapter'
import config from '@payload-config'
import { getPayload } from 'payload'

const mailsendTemplateID = '3vz9dle2xrnlkj50' //https://app.mailersend.com/templates/3vz9dle2xrnlkj50/edit
const mailersendRateLimitPerMinute = 60
const mailersendBufferMS = 100
const mailersendIntervalMS = Math.ceil(60000 / mailersendRateLimitPerMinute) + mailersendBufferMS

const mailerSendSleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error

  try {
    return JSON.stringify(error)
  } catch {
    return 'Unknown send failure'
  }
}

const buildRequiredSubscriberFields = (subscriber: {
  email?: string | null
  firstName?: string | null
  id: number | string
  lastName?: string | null
  subscribed?: boolean | null
  unsubscribeToken?: string | null
}) => ({
  email: subscriber.email || `unknown-${subscriber.id}@invalid.local`,
  firstName: subscriber.firstName?.trim() || 'Unknown',
  lastName: subscriber.lastName?.trim() || 'Unknown',
  subscribed: subscriber.subscribed ?? true,
  unsubscribeToken: subscriber.unsubscribeToken || String(subscriber.id),
})

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const subscribers = await payload.find({
    collection: 'emailSubscribers',
    where: {
      subscribed: {
        equals: true,
      },
      sent: {
        equals: false || null,
      },
      failed: {
        equals: false || null,
      },
    },
    pagination: false,
  })

  if (subscribers && subscribers.docs.length > 0) {
    let successCount = 0
    let failedCount = 0
    let nextAllowedSendAt = Date.now()

    for (const subscriber of subscribers.docs) {
      const waitMS = nextAllowedSendAt - Date.now()
      if (waitMS > 0) {
        await mailerSendSleep(waitMS)
      }
      nextAllowedSendAt = Date.now() + mailersendIntervalMS

      const requiredSubscriberFields = buildRequiredSubscriberFields(subscriber)

      try {
        await mailerSendTemplateAdapter(
          mailsendTemplateID,
          'Bulk Mail Sender - Stillwater Festival 2026',
          [
            {
              email: subscriber.email,
              name: subscriber.firstName || '',
            },
          ],
          [
            {
              email: subscriber.email,
              data: {
                recipientName: subscriber.firstName || '',
                emailSubject: 'Bulk Mail Sender - Stillwater Festival 2026',
                messageTitle: 'Bulk Mail Sender - Stillwater Festival 2026',
                messageBody: 'Bulk Mail Sender - Stillwater Festival 2026',
              },
            },
          ],
          payload.logger,
          payload,
        )

        await payload.update({
          collection: 'emailSubscribers',
          id: subscriber.id,
          data: {
            ...requiredSubscriberFields,
            sent: true,
            sentDate: new Date().toISOString(),
            failed: false,
            failedDate: null,
            failedReason: null,
          },
          overrideAccess: true,
        })

        successCount += 1
      } catch (error) {
        try {
          await payload.update({
            collection: 'emailSubscribers',
            id: subscriber.id,
            data: {
              ...requiredSubscriberFields,
              sent: false,
              failed: true,
              failedDate: new Date().toISOString(),
              failedReason: getErrorMessage(error),
            },
            overrideAccess: true,
          })
        } catch (updateError) {
          payload.logger.error(
            {
              subscriberId: subscriber.id,
              updateError: getErrorMessage(updateError),
            },
            'Failed to persist failure state for email subscriber',
          )
        }

        failedCount += 1
      }
    }

    console.log(
      `Attempted ${subscribers.docs.length} messages. Sent: ${successCount}, Failed: ${failedCount}`,
    )
    return Response.json({
      mailSent: successCount > 0,
      attempted: subscribers.docs.length,
      success: successCount,
      failed: failedCount,
    })
  } else {
    return Response.json({
      mailSent: false,
      attempted: 0,
      success: 0,
      failed: 0,
      message: 'No subscribers found to send mail to.',
    })
  }
}
