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
  auth: {
    forgotPassword: {
      generateEmailHTML: async ({ token, user }: { token?: string; user?: any }) => {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const resetURL = `${baseURL}/forgot-password/reset?token=${token}`
        return `<p>Hi ${user.firstName},</p>
          <p>Please click the link below to reset your UHTFC password:</p>
          <p><a href="${resetURL}">Reset your password</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best regards,</p>
          <p>The UHTFC Team</p>`
      },
      generateEmailSubject: async () => 'Reset your UHTFC password',
    },
  },
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
