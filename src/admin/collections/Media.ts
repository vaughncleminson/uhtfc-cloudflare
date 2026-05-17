import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  // Sets the default order for the Admin UI list view
  defaultSort: 'alt',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
    },
  ],
  upload: {
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
}
