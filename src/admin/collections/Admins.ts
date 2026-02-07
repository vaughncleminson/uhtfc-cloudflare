import type { CollectionConfig } from 'payload'

export const Admins: CollectionConfig = {
  slug: 'admins',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role'],
  },
  auth: {
    // disableLocalStrategy: true,
    // strategies: [
    //   {
    //     name: 'custom-strategy',
    //     authenticate: async (args) => {
    //       return {} as any
    //     },
    //   },
    // ],
  },
  hooks: {},
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Viewer',
          value: 'viewer',
        },
      ],
      defaultValue: 'viewer',
    },
    {
      type: 'group',
      name: 'mfa',
      label: 'Mutli-factor Authentication',
      fields: [
        {
          type: 'json',
          name: 'mfaSettings',
          label: 'Multi-factor Authentication Settings',
          defaultValue: {
            enabled: false,
            mfaSecret: '',
            mfaURL: '',
          },
          admin: {
            components: {
              Field: '@/admin/components/MFA/MFA#MFA',
            },
          },
        },
      ],
    },
  ],
}
