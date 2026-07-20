import type { Payload } from 'payload'

type EmailAddress = {
  email: string
  name?: string
}

type EmailAuditStatus = 'sent' | 'skipped' | 'failed'
type EmailDeliveryType = 'standard' | 'template'

type EmailAuditRecordInput = {
  status: EmailAuditStatus
  deliveryType: EmailDeliveryType
  subject: string
  fromEmail: string
  fromName?: string
  replyToEmail?: string
  replyToName?: string
  to: EmailAddress[]
  cc?: EmailAddress[]
  bcc?: EmailAddress[]
  templateId?: string
  skipReason?: string
  error?: string
  response?: unknown
  meta?: unknown
}

export async function recordEmailAudit(payload: Payload, record: EmailAuditRecordInput) {
  try {
    await payload.create({
      collection: 'emailAuditLogs',
      data: {
        sentAt: new Date().toISOString(),
        provider: 'mailersend',
        status: record.status,
        deliveryType: record.deliveryType,
        subject: record.subject,
        templateId: record.templateId,
        fromEmail: record.fromEmail,
        fromName: record.fromName,
        replyToEmail: record.replyToEmail,
        replyToName: record.replyToName,
        to: record.to,
        cc: record.cc,
        bcc: record.bcc,
        skipReason: record.skipReason,
        error: record.error,
        response: record.response,
        meta: record.meta,
      },
      overrideAccess: true,
    })
  } catch (error) {
    payload.logger.error({
      msg: 'Failed to write email audit record.',
      error: error instanceof Error ? error.message : error,
    })
  }
}

export type { EmailAddress, EmailAuditRecordInput }
