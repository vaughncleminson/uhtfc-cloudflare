import type { CollectionConfig } from 'payload'

export const PreviousUsers: CollectionConfig = {
  slug: 'previousUsers',
  // Sets the default order for the Admin UI list view
  defaultSort: 'email',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['fullName', 'email', 'role'],
    components: {
      beforeListTable: ['@/admin/components/ImportExport/import#ImportCSVButton'],
    },
  },
  hooks: {},
  fields: [
    {
      type: 'email',
      name: 'email',
      required: true,
    },
    {
      type: 'text',
      name: 'fullName',
      required: true,
    },
    {
      type: 'text',
      name: 'role',
      required: true,
    },
    {
      type: 'text',
      label: 'Reset UUID',
      name: 'resetUuid',
    },
    {
      type: 'checkbox',
      label: 'Has reset',
      name: 'reset',
      defaultValue: false,
    },
  ],
}
