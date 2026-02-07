import { GlobalConfig } from 'payload'

export const BookingSettings: GlobalConfig = {
  slug: 'bookingSettings',
  fields: [
    {
      name: 'futureBookings',
      type: 'array',
      label: 'Future Bookings',
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
          name: 'nonMembers',
          type: 'number',
          label: 'Non-Members',
        },
        {
          name: 'corporateGuests',
          type: 'number',
          label: 'Corporate Guests',
        },
        {
          name: 'eventGuests',
          type: 'number',
          label: 'Event Guests',
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
    },
  ],
}
