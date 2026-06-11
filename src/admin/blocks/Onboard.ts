import { Block } from 'payload'

export const Onboard: Block = {
  slug: 'onboard',
  interfaceName: 'OnboardBlock',
  fields: [
    {
      type: 'upload',
      name: 'image',
      label: 'Image',
      relationTo: 'media',
    },
  ],
}
