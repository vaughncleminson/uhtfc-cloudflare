import config from '@payload-config'
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend'
import { getPayload } from 'payload'

const mailerSend = new MailerSend({
  apiKey: process.env.MAILSEND_TOKEN || '',
})

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const subscribers = await payload.find({
    collection: 'emailSubscribers',
    where: {
      subscribed: {
        equals: true,
      },
    },
    pagination: false,
  })

  const sentFrom = new Sender('no-reply@uhtfc.org.za', 'The Underberg-Himeville Trout Fishing Club')
  const replyTo = new Sender('uhtfc.office@gmail.com', 'The Underberg-Himeville Trout Fishing Club')
  const bulkEmails = []

  if (subscribers && subscribers.docs.length > 0) {
    for (const subscriber of subscribers.docs) {
      const personalization = [
        {
          email: subscriber.email,
          data: {
            name: subscriber.firstName,
            account_name: 'UHTFC',
          },
        },
      ]
      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo([new Recipient(subscriber.email, `${subscriber.firstName} ${subscriber.lastName}`)])
        .setReplyTo(replyTo)
        .setSubject('UHTFC AGM - 27th September 2025')
        .setPersonalization(personalization)
        .setTemplateId('z86org8onyn4ew13')

      bulkEmails.push(emailParams)
    }
    const messagesSent = await mailerSend.email.sendBulk(bulkEmails)
    console.log(messagesSent)
    return Response.json({ mailSent: true })
  } else {
    return Response.json({ mailSent: false })
  }
}
