import type { CollectionConfig } from 'payload'
import { LineItems } from '../fields/LineItems'

export const FestivalEntries: CollectionConfig = {
  slug: 'festivalEntries',
  admin: {},
  hooks: {},
  fields: [
    {
      type: 'text',
      name: 'teamName',
      label: 'Team Name',
      required: true,
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
          name: 'size',
          label: 'size',
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
