import { Block } from 'payload'

export const MyCatchReturns: Block = {
  slug: 'myCatchReturns',
  interfaceName: 'MyCatchReturnsBlock',
  fields: [
    {
      type: 'text',
      name: 'title',
      label: 'Title',
      defaultValue: 'My Catch Returns',
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
