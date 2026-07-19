import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import type { Payload } from 'payload'
import { recordEmailAudit } from './emailAuditLog'

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

type SendFormattedTemplateEmailArgs = {
  templateId: string
  email: string
  recipientName: string
  messageTitle: string
  messageBody: string
  logger?: TemplateLogger
  payload?: Payload
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
  logger?: TemplateLogger,
  payload?: Payload,
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
    if (payload) {
      await recordEmailAudit(payload, {
        status: 'skipped',
        deliveryType: 'template',
        subject,
        templateId,
        fromEmail: 'no-reply@uhtfc.org.za',
        fromName: 'The Underberg-Himeville Trout Fishing Club',
        replyToEmail: 'uhtfc.office@gmail.com',
        replyToName: 'The Underberg-Himeville Trout Fishing Club',
        to: recipients,
        skipReason: 'MAILSEND_TOKEN is not configured',
      })
    }
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

  try {
    const messagesSent = await mailerSend.email.send(emailParams)
    logger?.info({ msg: 'MailerSend template email sent.', messagesSent })

    if (payload) {
      await recordEmailAudit(payload, {
        status: 'sent',
        deliveryType: 'template',
        subject,
        templateId,
        fromEmail: 'no-reply@uhtfc.org.za',
        fromName: 'The Underberg-Himeville Trout Fishing Club',
        replyToEmail: 'uhtfc.office@gmail.com',
        replyToName: 'The Underberg-Himeville Trout Fishing Club',
        to: recipients,
        response: messagesSent,
        meta: {
          personalizationCount: personalizationData.length,
        },
      })
    }

    return messagesSent
  } catch (error) {
    if (payload) {
      await recordEmailAudit(payload, {
        status: 'failed',
        deliveryType: 'template',
        subject,
        templateId,
        fromEmail: 'no-reply@uhtfc.org.za',
        fromName: 'The Underberg-Himeville Trout Fishing Club',
        replyToEmail: 'uhtfc.office@gmail.com',
        replyToName: 'The Underberg-Himeville Trout Fishing Club',
        to: recipients,
        error: error instanceof Error ? error.message : String(error),
        meta: {
          personalizationCount: personalizationData.length,
        },
      })
    }

    throw error
  }
}

export async function sendFormattedTemplateEmail({
  templateId,
  email,
  recipientName,
  messageTitle,
  messageBody,
  logger,
  payload,
}: SendFormattedTemplateEmailArgs) {
  return mailerSendTemplateAdapter(
    templateId,
    messageTitle,
    [{ email, name: recipientName }],
    [
      {
        email,
        data: {
          recipientName,
          emailSubject: messageTitle,
          messageTitle,
          messageBody,
        },
      },
    ],
    logger,
    payload,
  )
}
