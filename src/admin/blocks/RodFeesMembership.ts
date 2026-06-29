import { Block } from 'payload'

export const RodFeesMembership: Block = {
  slug: 'rodFeesMembership',
  interfaceName: 'RodFeesMembershipBlock',
  fields: [
    {
      type: 'upload',
      name: 'image',
      label: 'Image',
      relationTo: 'media',
    },
  ],
}
