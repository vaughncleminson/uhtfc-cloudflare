import { Block } from 'payload'

export const Payments: Block = {
  slug: 'payments',
  interfaceName: 'PaymentsBlock',
  fields: [
    {
      type: 'text',
      name: 'title',
      label: 'Title',
      defaultValue: 'Payments',
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
