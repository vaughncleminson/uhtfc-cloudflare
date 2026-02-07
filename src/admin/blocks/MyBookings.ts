import { Block } from 'payload'

export const MyBookings: Block = {
  slug: 'myBookings',
  interfaceName: 'MyBookingsBlock',
  fields: [
    {
      type: 'text',
      name: 'title',
      label: 'Title',
      defaultValue: 'My Bookings',
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
