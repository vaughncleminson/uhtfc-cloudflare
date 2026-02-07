import { Block } from 'payload'
import { linkGroup } from '../fields/LinkGroup'

export const LocationHero: Block = {
  slug: 'locationHero',
  interfaceName: 'LocationHeroBlock',
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      type: 'group',
      name: 'btns',
      label: 'Standard Buttons',
      fields: [linkGroup()],
    },
  ],
}
