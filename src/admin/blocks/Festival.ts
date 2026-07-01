import { Block } from 'payload'

export const Festival: Block = {
  slug: 'festival',
  interfaceName: 'FestivalBlock',

  fields: [
    {
      name: 'festival',
      label: 'Festival',
      type: 'relationship',
      relationTo: 'festivals',
      required: true,
    },
  ],
}
