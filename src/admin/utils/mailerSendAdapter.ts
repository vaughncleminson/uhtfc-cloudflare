import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend'
import type { PayloadEmailAdapter, SendEmailOptions } from 'payload'
import { recordEmailAudit, type EmailAddress } from './emailAuditLog'

type AdapterOptions = {
  apiKey: string
  defaultFromAddress: string
  defaultFromName: string
  defaultReplyToAddress?: string
  defaultReplyToName?: string
}

const splitCsv = (value: string): string[] =>
  value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

const toAddressList = (
  value: SendEmailOptions['to'] | SendEmailOptions['cc'] | SendEmailOptions['bcc'],
): EmailAddress[] => {
  if (!value) return []

  if (typeof value === 'string') {
    return splitCsv(value).map((email) => ({ email }))
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => toAddressList(entry))
  }

  if (typeof value === 'object' && 'address' in value && typeof value.address === 'string') {
    return [{ email: value.address, name: 'name' in value ? value.name : undefined }]
  }

  return []
}

const toSingleAddress = (value: SendEmailOptions['replyTo']): EmailAddress | undefined => {
  if (!value) return undefined

  if (typeof value === 'string') {
    const [email] = splitCsv(value)
    return email ? { email } : undefined
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const recipient = toSingleAddress(entry)
      if (recipient) return recipient
    }
    return undefined
  }

  if (typeof value === 'object' && 'address' in value && typeof value.address === 'string') {
    return { email: value.address, name: 'name' in value ? value.name : undefined }
  }

  return undefined
}

const toRecipients = (value: SendEmailOptions['to']): Recipient[] => {
  return toAddressList(value).map((entry) => new Recipient(entry.email, entry.name))
}

const toRecipient = (value: SendEmailOptions['replyTo']): Recipient | undefined => {
  const entry = toSingleAddress(value)
  return entry ? new Recipient(entry.email, entry.name) : undefined
}

const toStringBody = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value
  if (value instanceof Buffer) return value.toString()
  return undefined
}

export const mailerSendAdapter = (options: AdapterOptions): PayloadEmailAdapter => {
  return ({ payload }) => {
    const hasApiKey = Boolean(options.apiKey)
    const mailerSend = hasApiKey ? new MailerSend({ apiKey: options.apiKey }) : null

    //log email SendEmailOptions for debugging
    payload.logger.info({ msg: 'MailerSend adapter initialized.', hasApiKey })
    // removed detailed logging of options to avoid exposing sensitive information like API keys in logs
    //payload.logger.info({ msg: 'MailerSend adapter options:', options })

    return {
      name: 'mailersend',
      defaultFromAddress: options.defaultFromAddress,
      defaultFromName: options.defaultFromName,
      sendEmail: async (message: SendEmailOptions) => {
        //log email message for debugging
        payload.logger.info({ msg: 'Sending email with MailerSend adapter.', message })

        const toList = toAddressList(message.to)
        const ccList = toAddressList(message.cc)
        const bccList = toAddressList(message.bcc)
        const defaultReplyTo = options.defaultReplyToAddress
          ? {
              email: options.defaultReplyToAddress,
              name: options.defaultReplyToName,
            }
          : undefined
        const replyToAddress = toSingleAddress(message.replyTo) || defaultReplyTo
        const subject = message.subject || '(no subject)'

        if (!mailerSend) {
          payload.logger.warn({ msg: 'Skipping email send: MAILSEND_TOKEN is not configured.' })
          await recordEmailAudit(payload, {
            status: 'skipped',
            deliveryType: 'standard',
            subject,
            fromEmail: options.defaultFromAddress,
            fromName: options.defaultFromName,
            replyToEmail: replyToAddress?.email,
            replyToName: replyToAddress?.name,
            to: toList,
            cc: ccList,
            bcc: bccList,
            skipReason: 'MAILSEND_TOKEN is not configured',
          })
          return
        }

        const to = toRecipients(message.to)
        if (to.length === 0) {
          payload.logger.warn({ msg: 'Skipping email send: no recipients provided.' })
          await recordEmailAudit(payload, {
            status: 'skipped',
            deliveryType: 'standard',
            subject,
            fromEmail: options.defaultFromAddress,
            fromName: options.defaultFromName,
            replyToEmail: replyToAddress?.email,
            replyToName: replyToAddress?.name,
            to: toList,
            cc: ccList,
            bcc: bccList,
            skipReason: 'No recipients provided',
          })
          return
        }

        const from = new Sender(options.defaultFromAddress, options.defaultFromName)
        const email = new EmailParams().setFrom(from).setTo(to).setSubject(subject)

        const cc = toRecipients(message.cc)
        if (cc.length > 0) {
          email.setCc(cc)
        }

        const bcc = toRecipients(message.bcc)
        if (bcc.length > 0) {
          email.setBcc(bcc)
        }

        const replyTo =
          toRecipient(message.replyTo) ||
          (options.defaultReplyToAddress
            ? new Recipient(options.defaultReplyToAddress, options.defaultReplyToName)
            : undefined)
        if (replyTo) {
          email.setReplyTo(replyTo)
        }

        const text = toStringBody(message.text)
        const html = toStringBody(message.html)

        if (text) {
          email.setText(text)
        }

        if (html) {
          email.setHtml(html)
        }

        try {
          const result = await mailerSend.email.send(email)
          await recordEmailAudit(payload, {
            status: 'sent',
            deliveryType: 'standard',
            subject,
            fromEmail: options.defaultFromAddress,
            fromName: options.defaultFromName,
            replyToEmail: replyToAddress?.email,
            replyToName: replyToAddress?.name,
            to: toList,
            cc: ccList,
            bcc: bccList,
            response: result,
            meta: {
              hasText: Boolean(text),
              hasHtml: Boolean(html),
            },
          })
          return result
        } catch (error) {
          await recordEmailAudit(payload, {
            status: 'failed',
            deliveryType: 'standard',
            subject,
            fromEmail: options.defaultFromAddress,
            fromName: options.defaultFromName,
            replyToEmail: replyToAddress?.email,
            replyToName: replyToAddress?.name,
            to: toList,
            cc: ccList,
            bcc: bccList,
            error: error instanceof Error ? error.message : String(error),
            meta: {
              hasText: Boolean(text),
              hasHtml: Boolean(html),
            },
          })
          throw error
        }
      },
    }
  }
}
