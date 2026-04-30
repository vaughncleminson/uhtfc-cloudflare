import { CollectionConfig } from 'payload'

export const BookingHistory: CollectionConfig = {
  slug: 'bookingHistory',
  fields: [
    {
      name: 'locationId',
      type: 'number',
      label: 'Location ID',
      required: true,
    },
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
    },
    {
      name: 'userId',
      type: 'number',
      label: 'User ID',
      required: true,
    },
    {
      name: 'members',
      type: 'number',
      label: 'Members',
    },
    {
      name: 'memberGuests',
      type: 'number',
      label: 'Member Guests',
    },
    {
      name: 'nonMembers',
      type: 'number',
      label: 'Non-Members',
    },
    {
      name: 'date',
      type: 'date',
      label: 'Date',
      required: true,
    },
    {
      name: 'rodsBooked',
      type: 'number',
      label: 'Rods Booked',
      required: true,
    },
  ],
}
