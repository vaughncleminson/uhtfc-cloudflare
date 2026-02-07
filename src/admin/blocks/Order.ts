import { Block } from 'payload'

export const Order: Block = {
  slug: 'order',
  interfaceName: 'OrderBlock',
  fields: [
    {
      type: 'text',
      name: 'title',
      label: 'Title',
      defaultValue: 'Order',
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
