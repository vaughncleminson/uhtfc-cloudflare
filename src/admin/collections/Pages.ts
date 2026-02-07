import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { CollectionConfig } from 'payload'
import { Auth } from '../blocks/Auth'
import { Booking } from '../blocks/Booking'
import { CatchReturns } from '../blocks/CatchReturns'
import { Hero } from '../blocks/Hero'
import { Locations } from '../blocks/Locations'
import { Map } from '../blocks/Map'
import { MapDefault } from '../blocks/MapDefault'
import { MyBookings } from '../blocks/MyBookings'
import { Order } from '../blocks/Order'
import { Payments } from '../blocks/Payments'
import { RodFeesMembership } from '../blocks/RodFeesMembership'
import { generatePreviewPath } from '../utils/generatePreviewPath'
import { populatePublishedAt } from './hooks/populatePublishedAt'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

// import { Hero } from '../blocks/Hero'
// import { DividerBar } from '../blocks/DividerBar'
// import { LogoScroller } from '../blocks/LogoScroller'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
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
    defaultColumns: ['title', 'slug'],
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
      label: 'Title',
      type: 'text',
      required: true,
      localized: true,
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
              blocks: [
                Hero,
                Auth,
                MapDefault,
                Map,
                RodFeesMembership,
                Booking,
                Locations,
                Order,
                MyBookings,
                CatchReturns,
                Payments,
              ],
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
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    // ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
}
