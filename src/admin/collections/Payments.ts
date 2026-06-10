import type { CollectionConfig } from 'payload'
import { LineItems } from '../fields/LineItems'

export const Payments: CollectionConfig = {
  slug: 'payments',
  // Sets the default order for the Admin UI list view
  defaultSort: 'date',
  admin: {
    defaultColumns: ['date', 'firstName', 'lastName', 'summary', 'totalAmount', 'status'],
  },
  hooks: {},
  fields: [
    {
      type: 'date',
      name: 'date',
      label: 'Date',
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
      type: 'text',
      name: 'summary',
      label: 'Summary',
    },
    {
      type: 'number',
      name: 'totalAmount',
      label: 'Total Amount',
      required: true,
    },
    {
      type: 'text',
      name: 'status',
      label: 'Status',
      required: true,
      defaultValue: 'pending',
    },
    LineItems,
    {
      type: 'number',
      name: 'orderId',
      label: 'Order ID',
      required: true,
    },
  ],
}
