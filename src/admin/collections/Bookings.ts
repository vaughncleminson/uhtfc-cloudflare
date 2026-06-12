import type { CollectionConfig } from 'payload'
import { LineItems } from '../fields/LineItems'
import { UserRole } from '../fields/UserRole'

const isValidPublicId = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  // Sets the default order for the Admin UI list view
  defaultSort: 'date',
  admin: {
    defaultColumns: ['firstName', 'lastName', 'location', 'role', 'date'],
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
      name: 'publicId',
      label: 'Public ID',
      required: true,
      unique: true,
      access: {
        update: () => false,
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === 'create' && !isValidPublicId(value)) {
              return crypto.randomUUID()
            }

            return value
          },
        ],
      },
      validate: (value: unknown) => {
        if (!isValidPublicId(value)) {
          return 'Public ID is required and cannot be empty.'
        }

        return true
      },
      admin: {
        readOnly: true,
      },
    },
    { type: 'number', name: 'orderId', label: 'Order ID' },
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
    },
    {
      type: 'text',
      name: 'locationName',
      label: 'Location Name',
    },
    {
      type: 'date',
      name: 'date',
      label: 'Date',
    },
    {
      type: 'checkbox',
      name: 'active',
      label: 'Active',
      defaultValue: false,
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
