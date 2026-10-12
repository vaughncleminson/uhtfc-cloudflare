import type { CollectionConfig } from 'payload'

const isValidPublicId = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

export const CatchReturns: CollectionConfig = {
  slug: 'catchReturns',
  defaultSort: 'date',
  admin: {
    listSearchableFields: ['locationName'],
    defaultColumns: ['booking', 'userId', 'locationName', 'returnCompleted', 'caught'],
  },
  hooks: {},
  fields: [
    {
      type: 'relationship',
      name: 'booking',
      label: 'Booking',
      // required: true,
      relationTo: 'bookings',
      admin: {
        components: {
          Cell: '@/admin/components/CatchReturns/BookingDateCell#BookingDateCell',
        },
      },
    },
    {
      type: 'number',
      name: 'userId',
      label: 'User',
      admin: {
        components: {
          Cell: '@/admin/components/CatchReturns/UserNameCell#UserNameCell',
        },
      },
    },
    {
      type: 'ui',
      name: 'userName',
      admin: {
        components: {
          Field: '@/admin/components/CatchReturns/UserNameField#UserNameField',
        },
      },
    },
    {
      type: 'text',
      name: 'locationName',
      label: 'Location Name',
    },
    {
      type: 'checkbox',
      name: 'returnCompleted',
      label: 'Return Completed',
      required: true,
      defaultValue: false,
      admin: {
        components: {
          Cell: '@/admin/components/BooleanCell#BooleanCell',
        },
      },
    },
    {
      type: 'checkbox',
      name: 'nilReturn',
      label: 'Nil Return',
      defaultValue: false,
      admin: {
        components: {
          Cell: '@/admin/components/BooleanCell#BooleanCell',
        },
      },
    },
    {
      type: 'ui',
      name: 'caught',
      label: 'Caught',
      admin: {
        disableListColumn: false,
        components: {
          Cell: '@/admin/components/CatchReturns/CaughtCell#CaughtCell',
        },
      },
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
    {
      type: 'array',
      name: 'returns',
      label: 'Catch Returns',
      fields: [
        {
          type: 'select',
          name: 'species',
          label: 'Species',
          required: true,
          options: [
            {
              label: 'Rainbow Trout',
              value: 'rainbow',
            },
            {
              label: 'Brown Trout',
              value: 'brown',
            },
            {
              label: 'Bass',
              value: 'bass',
            },
          ],
        },
        {
          type: 'number',
          name: 'quantity',
          label: 'Quantity',
          required: true,
        },
        {
          type: 'number',
          name: 'length',
          label: 'Length (cm)',
          required: true,
        },
        {
          type: 'checkbox',
          name: 'released',
          label: 'Fish Released',
          defaultValue: true,
          admin: {
            components: {
              Cell: '@/admin/components/BooleanCell#BooleanCell',
            },
          },
        },
      ],
    },
    {
      type: 'group',
      name: 'stats',
      label: 'Stats',
      fields: [
        {
          type: 'number',
          name: 'total',
          label: 'Total Fish',
          defaultValue: 0,
          required: true,
        },
        {
          type: 'number',
          name: 'averageLength',
          label: 'Average Length',
          defaultValue: 0,
          required: true,
        },
        {
          type: 'number',
          name: 'largeFish',
          label: 'Largest Fish',
          defaultValue: 0,
          required: true,
        },
      ],
    },
    {
      type: 'textarea',
      name: 'comments',
      label: 'Any comments, such as maintenance needed',
      defaultValue: '',
      required: false,
    },
  ],
}
