import type { CollectionConfig } from 'payload'

const recipientFields = [
  {
    name: 'email',
    type: 'email',
    required: true,
  },
  {
    name: 'name',
    type: 'text',
  },
] as const

export const EmailAuditLogs: CollectionConfig = {
  slug: 'emailAuditLogs',
  defaultSort: '-sentAt',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['firstToEmail', 'sentAt', 'subject', 'status', 'deliveryType'],
    group: 'Data Management',
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        const firstRecipient =
          doc && typeof doc === 'object' && Array.isArray((doc as { to?: unknown }).to)
            ? ((doc as { to: Array<{ email?: unknown }> }).to[0] ?? null)
            : null

        const firstToEmail =
          firstRecipient && typeof firstRecipient.email === 'string' ? firstRecipient.email : ''

        return {
          ...doc,
          firstToEmail,
        }
      },
    ],
  },
  fields: [
    {
      name: 'firstToEmail',
      type: 'text',
      label: 'To',
      virtual: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Sent',
          value: 'sent',
        },
        {
          label: 'Skipped',
          value: 'skipped',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
      ],
    },
    {
      name: 'deliveryType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Standard',
          value: 'standard',
        },
        {
          label: 'Template',
          value: 'template',
        },
      ],
    },
    {
      name: 'provider',
      type: 'text',
      required: true,
      defaultValue: 'mailersend',
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'templateId',
      type: 'text',
    },
    {
      name: 'fromEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'fromName',
      type: 'text',
    },
    {
      name: 'replyToEmail',
      type: 'email',
    },
    {
      name: 'replyToName',
      type: 'text',
    },
    {
      name: 'to',
      type: 'array',
      required: true,
      fields: [...recipientFields],
    },
    {
      name: 'cc',
      type: 'array',
      fields: [...recipientFields],
    },
    {
      name: 'bcc',
      type: 'array',
      fields: [...recipientFields],
    },
    {
      name: 'skipReason',
      type: 'text',
    },
    {
      name: 'error',
      type: 'text',
    },
    {
      name: 'response',
      type: 'json',
    },
    {
      name: 'meta',
      type: 'json',
    },
  ],
}
