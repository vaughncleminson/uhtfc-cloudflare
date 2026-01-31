import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  //test
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
