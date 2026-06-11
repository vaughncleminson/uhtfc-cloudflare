import type { CollectionConfig } from 'payload'
import { UserRole } from '../fields/UserRole'

export const Users: CollectionConfig = {
  slug: 'users',
  // Sets the default order for the Admin UI list view
  defaultSort: 'email',
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
      type: 'array',
      name: 'vehicles',
      label: 'Vehicles',
      fields: [
        {
          type: 'text',
          name: 'vehicleRegistration',
          label: 'Vehicle Registration',
        },
        {
          type: 'text',
          name: 'vehicleModel',
          label: 'Vehicle Model',
        },
        {
          type: 'text',
          name: 'vehicleColour',
          label: 'Vehicle Colour',
        },
      ],
    },
    {
      type: 'text',
      name: 'physicalAddress',
      label: 'Physical Address',
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
    {
      type: 'number',
      name: 'arrearsAmount',
      label: 'Arrears Amount',
      defaultValue: 0,
      admin: {
        condition: (data, siblingData) => {
          return siblingData?.subsDue === true
        },
      },
    },
  ],
}
