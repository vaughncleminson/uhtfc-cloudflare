import { Block } from 'payload'

export const MapDefault: Block = {
  slug: 'mapDefault',
  interfaceName: 'MapDefaultBlock',
  fields: [
    {
      type: 'text',
      name: 'title',
      label: 'Title',
      defaultValue: 'Map all locations',
    },
  ],
}
