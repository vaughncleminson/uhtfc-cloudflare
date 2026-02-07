import type { CollectionConfig } from 'payload'
import { UserRole } from '../fields/UserRole'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role'],
  },
  auth: {},
  hooks: {},
  fields: [
    {
      type: 'text',
      name: 'firstName',
      required: true,
    },
    {
      type: 'text',
      name: 'lastName',
      required: true,
    },
    {
      type: 'text',
      name: 'mobileNumber',
      label: 'Mobile Number',
      required: true,
    },
    {
      type: 'text',
      name: 'idNumber',
      label: 'ID Number',
    },

    {
      type: 'text',
      name: 'street',
      label: 'Street Address',
    },
    {
      type: 'text',
      name: 'city',
      label: 'City',
    },
    {
      type: 'text',
      name: 'province',
      label: 'Province',
    },
    {
      type: 'text',
      name: 'postalCode',
      label: 'Postal Code',
    },
    {
      type: 'text',
      name: 'country',
      label: 'Country',
    },
    UserRole,
    {
      type: 'select',
      name: 'membershipType',
      label: 'Membership Type',
      options: [
        {
          label: 'Ordinary Member',
          value: 'OM',
        },
        {
          label: 'Ordinary Member & Wife',
          value: 'OMW',
        },
        {
          label: 'Family Member',
          value: 'F',
        },
        {
          label: 'Junior Member',
          value: 'J',
        },
        {
          label: 'Senior Member',
          value: 'S',
        },
        {
          label: 'Corporate Member',
          value: 'C',
        },
        {
          label: 'Complimentary',
          value: 'COMP',
        },
        {
          label: 'Riperian Owner',
          value: 'R',
        },
      ],
    },
    {
      type: 'checkbox',
      name: 'blocked',
      label: 'Blocked',
      defaultValue: false,
    },
    {
      type: 'checkbox',
      name: 'subsDue',
      label: 'Subs Due',
      defaultValue: false,
    },
  ],
}
