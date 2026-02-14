import { Block } from 'payload'

export const Booking: Block = {
  slug: 'booking',
  interfaceName: 'BookingBlock',
  fields: [
    {
      type: 'upload',
      name: 'image',
      label: 'Image',
      relationTo: 'media',
    },
    
  ],
}
