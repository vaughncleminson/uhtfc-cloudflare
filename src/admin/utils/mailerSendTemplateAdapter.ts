import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import type { Payload } from 'payload'

export type TemplateRecipient = {
  email: string
  name?: string
}

export type TemplateData = {
  recipientName: string
  emailSubject: string
  messageTitle: string
  messageBody: string
}

export type TemplatePersonalization = {
  email: string
  data: TemplateData
}

type TemplateLogger = Pick<Payload['logger'], 'info' | 'warn'>

const mailerSendToken = process.env.MAILSEND_TOKEN || process.env.API_KEY || ''
const mailerSend = mailerSendToken ? new MailerSend({ apiKey: mailerSendToken }) : null

const toRecipients = (recipients: TemplateRecipient[]): Recipient[] => {
  return recipients.map((recipient) => new Recipient(recipient.email, recipient.name))
}

export default async function mailerSendTemplateAdapter(
  templateId: string,
  subject: string,
  recipients: TemplateRecipient[],
  personalizationData: TemplatePersonalization[],
  logger?: TemplateLogger,
) {
  logger?.info({
    msg: 'Sending template email with MailerSend adapter.',
    templateId,
    subject,
    recipients,
    personalizationData,
  })

  if (!mailerSend) {
    logger?.warn({ msg: 'Skipping MailerSend template email: MAILSEND_TOKEN is not configured.' })
    return null
  }

  const sentFrom = new Sender('no-reply@uhtfc.org.za', 'The Underberg-Himeville Trout Fishing Club')
  const replyTo = new Sender('uhtfc.office@gmail.com', 'The Underberg-Himeville Trout Fishing Club')

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(toRecipients(recipients))
    .setReplyTo(replyTo)
    .setSubject(subject)
    .setTemplateId(templateId)
    .setPersonalization(personalizationData)

  const messagesSent = await mailerSend.email.send(emailParams)
  logger?.info({ msg: 'MailerSend template email sent.', messagesSent })
  return messagesSent
}
