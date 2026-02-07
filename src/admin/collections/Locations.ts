import { slugField } from '@/admin/components/slug'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { CollectionConfig } from 'payload'
import { LocationDetails } from '../blocks/LocationDetails'
import { LocationHero } from '../blocks/LocationHero'
import { Map } from '../blocks/Map'
import { generatePreviewPath } from '../utils/generatePreviewPath'
import { populatePublishedAt } from './hooks/populatePublishedAt'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

export const Locations: CollectionConfig<'pages'> = {
  slug: 'locations',
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
  access: {
    read: () => true,
  },
  defaultPopulate: {
    title: true,
  },
  admin: {
    defaultColumns: ['title', 'type', 'enabled'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
        })
        return path
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
      })
      return path
    },
  },
  fields: [
    {
      name: 'title',
      label: 'Location name',
      type: 'text',
      required: true,
    },
    {
      name: 'topic',
      label: 'Topic',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Trout',
          value: 'trout',
        },
        {
          label: 'Bass',
          value: 'bass',
        },
      ],
      hasMany: true,
    },
    {
      name: 'type',
      type: 'select',
      label: 'Location Type',
      hasMany: false,
      required: true,
      admin: {},
      options: [
        {
          label: 'River',
          value: 'river',
        },
        {
          label: 'Stillwater',
          value: 'stillwater',
        },
      ],
    },
    {
      name: 'enabled',
      label: 'Location Enabled',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'temporarilyClosed',
      label: 'Temporarily Closed',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'closureReason',
      label: 'Closure Reason',
      type: 'text',
      admin: {
        condition: (data) => data.temporarilyClosed,
      },
    },
    {
      name: 'closureFromDate',
      label: 'Closure From Date',
      type: 'date',
      admin: {
        condition: (data) => data.temporarilyClosed,
      },
    },
    {
      name: 'closureToDate',
      label: 'Closure To Date',
      type: 'date',
      admin: {
        condition: (data) => data.temporarilyClosed,
      },
    },

    {
      type: 'tabs',
      tabs: [
        {
          label: 'Layout',
          admin: {},
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [LocationHero, LocationDetails, Map],
              required: true,
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
}
