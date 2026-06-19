import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

export const TwoColumnTextLeft: Block = {
  slug: 'twoColumnTextLeft',
  interfaceName: 'TwoColumnTextLeftBlock',
  fields: [
    {
      name: 'variant',
      label: 'Style Variant',
      type: 'select',
      defaultValue: 'lightContent',
      options: [
        {
          label: 'Light Content Page',
          value: 'lightContent',
        },
        {
          label: 'Dark Split',
          value: 'darkSplit',
        },
      ],
      required: true,
    },
    {
      name: 'title',
      label: 'Title',
      type: 'text',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'richText',
      required: true,
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
      type: 'upload',
      name: 'image',
      label: 'Right Column Image',
      relationTo: 'media',
    },
  ],
}
