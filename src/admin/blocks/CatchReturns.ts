import { Block } from 'payload'

export const CatchReturns: Block = {
  slug: 'catchReturns',
  interfaceName: 'CatchReturnsBlock',
  fields: [
    {
      type: 'text',
      name: 'title',
      label: 'Title',
      defaultValue: 'Catch Returns',
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
