import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

export const LocationDetails: Block = {
  slug: 'locationDetails',
  interfaceName: 'LocationDetailsBlock',
  fields: [
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
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
      name: 'rodLimit',
      label: 'Rod Limit',
      type: 'number',
      defaultValue: 2,
      required: true,
    },
    {
      name: 'membersOnly',
      label: 'Members Only',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'bagLimit',
      label: 'Bag Limit',
      type: 'text',
      defaultValue: '2 X 450g',
      required: true,
    },
    {
      name: 'hasBoats',
      label: 'Has Boats',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'hasBass',
      label: 'Has Bass',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'fishingMethods',
      type: 'select',
      label: 'Fishing Methods',
      hasMany: false,
      required: true,
      admin: {},
      options: [
        {
          label: 'Bank only',
          value: 'Bank only',
        },
        {
          label: 'Float tube',
          value: 'Float tube',
        },
        {
          label: 'Bank & float tube',
          value: 'Bank & float tube',
        },
        {
          label: 'Float tube & boat',
          value: 'Float tube & boat',
        },
        {
          label: 'Bank, float tube & boat',
          value: 'Bank, float tube & boat',
        },
      ],
    },
    {
      type: 'checkbox',
      name: 'requiresKey',
      label: 'Requires Key',
      defaultValue: false,
    },
    {
      type: 'checkbox',
      name: 'requiresGateCode',
      label: 'Requires Gate Code',
      defaultValue: false,
    },
    {
      name: 'accessInstructions',
      label: 'Access Instructions (key or gate code)',
      type: 'text',
      admin: {
        condition: (data) => {
          const detail = data.layout?.find((e: any) => e.blockType === 'locationDetails')
          return detail && (detail.requiresKey || detail.requiresGateCode)
        },
      },
    },
    {
      name: 'sendLandownerEmail',
      label: 'Send Landowner Notification of Booking Email',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'landownerEmail',
      label: 'Landowner Email',
      type: 'email',
      admin: {
        condition: (data) => {
          const detail = data.layout?.find((e: any) => e.blockType === 'locationDetails')
          return detail && detail.sendLandownerEmail
        },
      },
    },
  ],
}
