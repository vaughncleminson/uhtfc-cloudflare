import { Block } from 'payload'
import { linkGroup } from '../fields/LinkGroup'

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
    },
    {
      name: 'subtitle',
      label: 'Subtitle',
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
    {
      type: 'select',
      name: 'size',
      label: 'Size',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Large', value: 'large' },
      ],
      defaultValue: 'large',
    },
    {
      type: 'text',
      name: 'blockName',
      label: 'Arrow scroll to block name',
    },
  ],
}
