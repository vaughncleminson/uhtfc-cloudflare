import type { CollectionConfig } from 'payload'

export const EmailSubscribers: CollectionConfig = {
  slug: 'emailSubscribers',

  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'subscribed', 'createdAt'],
    components: {
      beforeListTable: [
        '@/admin/components/ImportExport/import#ImportCSVButton',
        '@/admin/components/Mailsend/sendBulkMail#SendBulkMail',
      ],
    },
  },
  hooks: {},
  fields: [
    {
      type: 'email',
      name: 'email',
      label: 'Email',
      required: true,
    },
    {
      type: 'text',
      name: 'firstName',
      label: 'First Name',
      required: true,
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'Last Name',
      required: true,
    },
    {
      type: 'checkbox',
      name: 'subscribed',
      label: 'Subscribed',
      required: true,
    },
    {
      type: 'text',
      name: 'unsubscribeToken',
      label: 'Unsubscribe Token',
      required: true,
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
