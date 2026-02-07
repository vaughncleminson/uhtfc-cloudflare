import type { CollectionConfig } from 'payload'
import { tr } from 'payload/i18n/tr'

export const CatchReturns: CollectionConfig = {
  slug: 'catchReturns',
  admin: {},
  hooks: {},
  fields: [
    {
      type: 'relationship',
      name: 'booking',
      label: 'Booking',
      // required: true,
      relationTo: 'bookings',
    },
    {
      type: 'checkbox',
      name: 'nilReturn',
      label: 'Nil Return',
      defaultValue: false,
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
  ],
}
