import type { CollectionConfig } from 'payload'

export const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {},
  hooks: {},
  fields: [
    {
      type: 'text',
      name: 'paymentId',
      label: 'Payment ID',
      required: true,
    },
    {
      type: 'text',
      name: 'userName',
      label: 'User Name',
      required: true,
    },
    {
      type: 'text',
      name: 'products',
      label: 'Products',
    },
    {
      type: 'text',
      name: 'details',
      label: 'Details',
    },
    {
      type: 'number',
      name: 'amount',
      label: 'Amount',
      required: true,
    },
    {
      type: 'text',
      name: 'currency',
      label: 'Currency',
    },
    {
      type: 'text',
      name: 'type',
      label: 'Type',
    },
    {
      type: 'text',
      name: 'status',
      label: 'Status',
      required: true,
    },
    {
      type: 'text',
      name: 'mode',
      label: 'Mode',
    },
    {
      type: 'relationship',
      name: 'order',
      label: 'Order',
      relationTo: 'orders',
    },
  ],
}
