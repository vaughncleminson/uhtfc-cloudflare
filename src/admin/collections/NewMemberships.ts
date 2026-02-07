import type { CollectionConfig } from 'payload'
import { LineItems } from '../fields/LineItems'

export const NewMemberships: CollectionConfig = {
  slug: 'newMemberships',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'membershipType', 'createdAt'],
  },
  hooks: {},
  fields: [
    {
      type: 'text',
      name: 'productType',
      label: 'Product Type',
      required: true,
      defaultValue: 'newMembership',
      admin: {
        readOnly: true,
      },
    },
    {
      type: 'number',
      name: 'userId',
      label: 'User ID',
      required: true,
    },
    {
      type: 'select',
      name: 'membershipType',
      label: 'Membership Type',
      required: true,
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
      ],
    },

    {
      type: 'text',
      name: 'firstName',
      label: 'First Name',
      required: true,
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'Last Name',
      required: true,
    },
    {
      type: 'text',
      name: 'idNumber',
      label: 'ID Number',
      required: true,
    },
    {
      type: 'email',
      name: 'email',
      label: 'Email',
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
      name: 'street',
      label: 'Street Address',
      required: true,
    },
    {
      type: 'text',
      name: 'city',
      label: 'City',
      required: true,
    },
    {
      type: 'text',
      name: 'province',
      label: 'Province',
      required: true,
    },
    {
      type: 'text',
      name: 'postalCode',
      label: 'Postal Code',
      required: true,
    },
    {
      type: 'text',
      name: 'country',
      label: 'Country',
      required: true,
    },
    {
      type: 'textarea',
      name: 'otherMemberships',
      label: 'Memberships of other fishing clubs',
      required: false,
    },
    {
      type: 'textarea',
      name: 'howDidYouHearAboutUs',
      label: 'How did you hear about the UHTFC?',
      required: false,
    },
    {
      type: 'number',
      name: 'totalAmount',
      defaultValue: 0,
    },
    {
      type: 'checkbox',
      name: 'acceptTerms',
      defaultValue: false,
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    LineItems,
  ],
}
