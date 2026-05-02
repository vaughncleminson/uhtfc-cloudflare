import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend'
import type { PayloadEmailAdapter, SendEmailOptions } from 'payload'

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

const toRecipients = (value: SendEmailOptions['to']): Recipient[] => {
  if (!value) return []

  if (typeof value === 'string') {
    return splitCsv(value).map((email) => new Recipient(email))
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => toRecipients(entry))
  }

  if (typeof value === 'object' && 'address' in value && typeof value.address === 'string') {
    return [new Recipient(value.address, 'name' in value ? value.name : undefined)]
  }

  return []
}

const toRecipient = (value: SendEmailOptions['replyTo']): Recipient | undefined => {
  if (!value) return undefined

  if (typeof value === 'string') {
    const [email] = splitCsv(value)
    return email ? new Recipient(email) : undefined
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const recipient = toRecipient(entry)
      if (recipient) return recipient
    }
    return undefined
  }

  if (typeof value === 'object' && 'address' in value && typeof value.address === 'string') {
    return new Recipient(value.address, 'name' in value ? value.name : undefined)
  }

  return undefined
}

const toStringBody = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value
  if (value instanceof Buffer) return value.toString('utf-8')
  return undefined
}

export const mailerSendAdapter = (options: AdapterOptions): PayloadEmailAdapter => {
  return ({ payload }) => {
    const hasApiKey = Boolean(options.apiKey)
    const mailerSend = hasApiKey ? new MailerSend({ apiKey: options.apiKey }) : null

    //log email SendEmailOptions for debugging
    payload.logger.info({ msg: 'MailerSend adapter initialized.', hasApiKey })
    payload.logger.info({ msg: 'MailerSend adapter options:', options })

    return {
      name: 'mailersend',
      defaultFromAddress: options.defaultFromAddress,
      defaultFromName: options.defaultFromName,
      sendEmail: async (message: SendEmailOptions) => {
        //log email message for debugging
        payload.logger.info({ msg: 'Sending email with MailerSend adapter.', message })

        if (!mailerSend) {
          payload.logger.warn({ msg: 'Skipping email send: MAILSEND_TOKEN is not configured.' })
          return
        }

        const to = toRecipients(message.to)
        if (to.length === 0) {
          payload.logger.warn({ msg: 'Skipping email send: no recipients provided.' })
          return
        }

        const from = new Sender(options.defaultFromAddress, options.defaultFromName)
        const email = new EmailParams()
          .setFrom(from)
          .setTo(to)
          .setSubject(message.subject || '(no subject)')

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

        return mailerSend.email.send(email)
      },
    }
  }
}
