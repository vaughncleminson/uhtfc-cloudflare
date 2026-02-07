import type { CollectionConfig } from 'payload'
import { LineItems } from '../fields/LineItems'
import { UserRole } from '../fields/UserRole'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    defaultColumns: ['userName', 'date', 'location', 'paymentStatus'],
  },
  hooks: {},
  fields: [
    {
      type: 'text',
      name: 'productType',
      label: 'Product Type',
      required: true,
      defaultValue: 'booking',
      admin: {
        readOnly: true,
      },
    },
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
    UserRole,
    {
      type: 'text',
      name: 'email',
      label: 'Email',
      required: true,
    },
    {
      type: 'relationship',
      name: 'location',
      label: 'Location',
      relationTo: 'locations',
      required: true,
    },
    {
      type: 'date',
      name: 'date',
      label: 'Date',
    },
    {
      type: 'array',
      name: 'anglers',
      label: 'Anglers',
      required: true,
      fields: [
        {
          type: 'number',
          name: 'userId',
          label: 'User ID',
        },
        {
          type: 'text',
          name: 'fullName',
          label: 'Angler',
        },
        {
          type: 'text',
          name: 'firstName',
          label: 'First Name',
        },
        {
          type: 'text',
          name: 'lastName',
          label: 'Last Name',
        },
        {
          type: 'email',
          name: 'email',
          label: 'Email',
        },
        UserRole,
      ],
    },

    {
      type: 'number',
      name: 'totalAmount',
      defaultValue: 0,
    },
    LineItems,
    {
      type: 'checkbox',
      name: 'acceptTerms',
      defaultValue: false,
    },
  ],
}
