import { Link } from '@/admin/fields/Link'
import { CollectionConfig } from 'payload'

export const Sections: CollectionConfig = {
  slug: 'sections',
  access: {},
  defaultPopulate: {
    // title: true,
  },
  admin: {
    // defaultColumns: ['title', 'slug'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Navigation Title',
    },
    {
      name: 'secs',
      type: 'array',
      label: 'L1 Sections',
      labels: {
        singular: 'L1 Section',
        plural: 'L1 Sections',
      },
      admin: {
        components: {
          RowLabel: '@/admin/components/ArrayRowLabel#ArrayRowLabel',
        },
      },
      fields: [
        {
          name: 'title',
          label: 'Section Title',
          type: 'text',
          required: true,
        },
        {
          name: 'urls',
          label: 'URLs',
          type: 'array',
          admin: {
            components: {
              RowLabel: '@/admin/components/ArrayRowLabel#ArrayRowLabel',
            },
          },
          fields: [Link()],
        },
        {
          name: 'subs',
          label: 'L2 Sections',
          labels: {
            singular: 'L2 Section',
            plural: 'L2 Sections',
          },
          type: 'array',
          admin: {
            components: {
              RowLabel: '@/admin/components/ArrayRowLabel#ArrayRowLabel',
            },
          },
          fields: [
            {
              name: 'title',
              label: 'Section Title',
              type: 'text',
              required: true,
            },
            {
              name: 'urls',
              label: 'URLs',
              type: 'array',
              admin: {
                components: {
                  RowLabel: '@/admin/components/ArrayRowLabel#ArrayRowLabel',
                },
              },
              fields: [Link()],
            },
            {
              name: 'subs2',
              label: 'L3 Sections',
              labels: {
                singular: 'L3 Section',
                plural: 'L3 Sections',
              },
              type: 'array',
              admin: {
                components: {
                  RowLabel: '@/admin/components/ArrayRowLabel#ArrayRowLabel',
                },
              },
              fields: [
                {
                  name: 'title',
                  label: 'Section Title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'urls',
                  label: 'URLs',
                  type: 'array',
                  admin: {
                    components: {
                      RowLabel: '@/admin/components/ArrayRowLabel#ArrayRowLabel',
                    },
                  },
                  fields: [Link()],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
