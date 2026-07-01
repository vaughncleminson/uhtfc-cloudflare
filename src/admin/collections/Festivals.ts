import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const Festivals: CollectionConfig = {
  slug: 'festivals',
  // Sets the default order for the Admin UI list view
  defaultSort: 'startDate',

  admin: {
    defaultColumns: ['festivalName', 'startDate', 'endDate'],
    useAsTitle: 'festivalName',
  },
  fields: [
    {
      type: 'text',
      name: 'festivalName',
      label: 'Festival Name',
      required: true,
    },
    {
      name: 'blurb',
      type: 'richText',
      label: 'Blurb',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
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
      name: 'extraMeals',
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
      name: 'sponsorImage',
      label: 'Sponsor Image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
