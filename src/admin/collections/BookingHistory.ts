import { CollectionConfig } from 'payload'

export const BookingHistory: CollectionConfig = {
  slug: 'bookingHistory',
  // Sets the default order for the Admin UI list view
  defaultSort: 'date',

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
      type: 'number',
      name: 'orderId',
      label: 'Order ID',
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
