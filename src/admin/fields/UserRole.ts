import type { Field } from 'payload'

export const UserRole: Field = {
  type: 'select',
  name: 'role',
  label: 'User Role',
  options: [
    {
      label: 'Non-member',
      value: 'non-member',
    },
    {
      label: 'Member',
      value: 'member',
    },
    {
      label: 'Member Guest',
      value: 'member-guest',
    },
    {
      label: 'Corporate Guest',
      value: 'corporate-guest',
    },
    {
      label: 'Admin',
      value: 'admin',
    },
  ],
}
