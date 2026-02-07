import type { CollectionConfig } from 'payload'
import { LineItems } from '../fields/LineItems'

export const Festivals: CollectionConfig = {
  slug: 'festivals',
  admin: {},
  hooks: {},
  fields: [
    {
      type: 'text',
      name: 'productType',
      label: 'Product Type',
      required: true,
      defaultValue: 'festivalEntry',
      admin: {
        readOnly: true,
      },
    },
    {
      type: 'text',
      name: 'festivalName',
      label: 'Festival Name',
      required: true,
    },
    {
      name: 'bookingsOpen',
      type: 'checkbox',
      label: 'Bookings Open',
      defaultValue: false,
    },
    {
      name: 'numberOfTeams',
      type: 'number',
      label: 'Number of Teams',
    },
    {
      name: 'entriesPerTeam',
      type: 'number',
      label: 'Entries Per Team',
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Start Date',
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'End Date',
    },
    {
      name: 'Event Duration',
      type: 'number',
      label: 'Event Duration',
    },
    {
      name: 'price',
      type: 'number',
      label: 'Cost per Team',
    },

    {
      name: 'extaMeals',
      type: 'number',
      label: 'Extra Meals Cost Per Person Per Day',
    },
    {
      name: 'giveAwayType', // required
      type: 'select', // required
      label: 'Give Away Type', // required
      hasMany: true,
      admin: {
        isClearable: true,
        isSortable: true, // use mouse to drag and drop different values, and sort them according to your choice
      },
      options: [
        {
          label: 'T-Shirt',
          value: 'tShirt',
        },
        {
          label: 'Hoodie',
          value: 'hoodie',
        },
        {
          label: 'Cap',
          value: 'cap',
        },
        {
          label: 'Hat',
          value: 'hat',
        },
      ],
    },
    {
      name: 'garmentSizes',
      type: 'select',
      label: 'Select available Garment Sizes',
      hasMany: true,
      admin: {
        isClearable: true,
        isSortable: true,
        condition: (data) => {
          return data.giveAwayType?.includes('tShirt') || data.giveAwayType?.includes('hoodie')
        },
      },
      options: [
        {
          label: 'Extra Small',
          value: 'xs',
        },
        {
          label: 'Small',
          value: 's',
        },
        {
          label: 'Medium',
          value: 'm',
        },
        {
          label: 'Large',
          value: 'l',
        },
        {
          label: 'Extra Large',
          value: 'xl',
        },
        {
          label: '2 Extra Large',
          value: '2xl',
        },
        {
          label: '3 Extra Large',
          value: '3xl',
        },
      ],
    },
    {
      name: 'hatSizes', // required
      type: 'select', // required
      label: 'Select Available Hat Sizes', // required
      hasMany: true,
      admin: {
        isClearable: true,
        isSortable: true,
        condition: (data) => {
          return data.giveAwayType?.includes('hat')
        },
      },
      options: [
        {
          label: 'Small',
          value: 's',
        },
        {
          label: 'Medium',
          value: 'm',
        },
        {
          label: 'Large',
          value: 'l',
        },
      ],
    },
    {
      type: 'array',
      name: 'teamMembers',
      label: 'Team Members',
      fields: [
        {
          type: 'text',
          name: 'fullName',
          label: 'Full Name',
          required: true,
        },
        {
          type: 'email',
          name: 'email',
          label: 'Email',
          required: true,
        },
        {
          type: 'text',
          name: 'mobile',
          label: 'Mobile Number',
          required: true,
        },
        {
          type: 'text',
          name: 'garmentSize',
          label: 'Garment Size',
          required: true,
        },
        {
          type: 'text',
          name: 'hatSize',
          label: 'Hat size',
          required: true,
        },
        {
          type: 'number',
          name: 'extraMeals',
          label: 'Extra Meals',
        },
      ],
      required: true,
    },
    {
      type: 'number',
      name: 'totalAmount',
      defaultValue: 0,
    },
    LineItems,
  ],
}
