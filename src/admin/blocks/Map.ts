import { Block } from 'payload'

export const Map: Block = {
  slug: 'map',
  interfaceName: 'MapBlock',
  fields: [
    {
      type: 'json',
      name: 'map',
      label: 'Map Markers',
      defaultValue: [],
      admin: {
        components: {
          Field: '@/admin/components/Map/Map#Map',
        },
      },
    },
    {
      type: 'json',
      name: 'specificDirections',
      label: 'Specific Directions Path',
    },
  ],
}
