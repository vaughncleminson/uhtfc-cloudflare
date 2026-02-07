import { GlobalConfig } from 'payload'
import { Link } from '../fields/Link'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'group',
      name: 'callToAction',
      label: 'Default call to Action',
      fields: [Link()],
    },
    {
      type: 'group',
      name: 'riversClosed',
      label: 'Rivers',
      fields: [
        {
          name: 'closeDate',
          type: 'date',
          label: 'Close Date',
          required: true,
        },
        {
          name: 'openDate',
          type: 'date',
          label: 'Open Date',
          required: true,
        },
      ],
    },
    {
      type: 'group',
      name: 'damsClosed',
      label: 'Dams',
      fields: [
        {
          name: 'closeDate',
          type: 'date',
          label: 'Close Date',
          required: true,
        },
        {
          name: 'openDate',
          type: 'date',
          label: 'Open Date',
          required: true,
        },
      ],
    },
    {
      type: 'group',
      name: 'bookingRules',
      label: 'Booking Rules',
      fields: [
        {
          name: 'allowedFutureBookingDays',
          type: 'number',
          label: 'Number of days in advance a user can book',
          required: true,
          defaultValue: 14,
        },
        {
          name: 'sameLocationBookingInWeek',
          type: 'number',
          label: 'Number of times a user can book the same location in a week',
          required: true,
          defaultValue: 1,
        },
        {
          name: 'sameLocationBookingInMonth',
          type: 'number',
          label: 'Number of times a user can book the same location in a month',
          required: true,
          defaultValue: 2,
        },
        {
          name: 'sameLocationBookingConsecutiveDays',
          type: 'checkbox',
          label: 'Disallow booking the same location on consecutive days',
          defaultValue: true,
          required: true,
        },
      ],
    },
    {
      type: 'group',
      name: 'subsSettings',
      label: 'Subs Settings',
      fields: [
        {
          name: 'joiningFee',
          label: 'Joining Fee',
          type: 'number',
          required: true,
        },
        {
          name: 'OM',
          label: 'Ordinary Member Subs',
          type: 'number',
          required: true,
        },
        {
          name: 'OMW',
          label: 'Ordinary Member & Wife Subs',
          type: 'number',
          required: true,
        },
        {
          name: 'F',
          label: 'Family Member Subs',
          type: 'number',
          required: true,
        },
        {
          name: 'J',
          label: 'Junior Member Subs',
          type: 'number',
          required: true,
        },
        {
          name: 'S',
          label: 'Senior Member Subs',
          type: 'number',
          required: true,
        },
        {
          name: 'C',
          label: 'Corporate Member Subs',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      type: 'group',
      name: 'fishingFees',
      label: 'Fishing Fees',
      fields: [
        {
          name: 'nonMember',
          type: 'number',
          label: 'Non Member',
          required: true,
        },
        {
          name: 'memberGuest',
          type: 'number',
          label: 'Member Guest',
          required: true,
        },
      ],
    },
    {
      type: 'group',
      name: 'emailSettings',
      label: 'Email Settings',
      fields: [
        {
          name: 'fromEmail',
          type: 'email',
          label: 'From Email',
          required: true,
        },
        {
          name: 'fromName',
          type: 'text',
          label: 'From Name',
          required: true,
        },
      ],
    },
  ],
}
