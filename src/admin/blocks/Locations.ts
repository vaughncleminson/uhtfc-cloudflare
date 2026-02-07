import { Block } from 'payload'

export const Locations: Block = {
  slug: 'locations',
  interfaceName: 'LocationsBlock',
  fields: [
    {
      type: 'text',
      name: 'title',
      label: 'Title',
      defaultValue: 'All locations',
    },
  ],
}
