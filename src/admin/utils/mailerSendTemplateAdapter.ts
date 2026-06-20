import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'

export type TemplateRecipient = {
  email: string
  name?: string
}

export type TemplatePersonalization = {
  email: string
  data: Record<string, unknown>
}

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
) {
  if (!mailerSend) {
    console.warn('Skipping MailerSend template email: MAILSEND_TOKEN is not configured.')
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
  console.log(messagesSent)
  return messagesSent
}
