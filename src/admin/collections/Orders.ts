import type { CollectionConfig } from 'payload'
import { LineItems } from '../fields/LineItems'
import { UserRole } from '../fields/UserRole'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'firstName',
    defaultColumns: ['firstName', 'lastName', 'paymentStatus', 'createdAt'],
  },
  hooks: {},
  fields: [
    {
      type: 'number',
      name: 'userId',
      label: 'User ID',
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
      type: 'email',
      name: 'email',
      label: 'Email',
      required: true,
    },
    UserRole,
    {
      type: 'select',
      name: 'paymentStatus',
      label: 'Payment Status',
      defaultValue: 'not-required',
      options: [
        {
          label: 'Not required',
          value: 'not-required',
        },
        {
          label: 'Payment Pending',
          value: 'payment-pending',
        },
        {
          label: 'Payment Received',
          value: 'payment-received',
        },
      ],
    },
    {
      type: 'json',
      name: 'products',
      label: 'Products',
      required: true,
    },
    {
      type: 'text',
      name: 'checkoutId',
      label: 'Checkout ID',
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'number',
      name: 'totalAmount',
      defaultValue: 0,
    },
    LineItems,
  ],
}
