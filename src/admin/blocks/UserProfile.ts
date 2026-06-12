import { Block } from 'payload'

export const UserProfile: Block = {
  slug: 'userProfile',
  interfaceName: 'UserProfileBlock',
  fields: [
    {
      type: 'upload',
      name: 'image',
      label: 'Image',
      relationTo: 'media',
    },
  ],
}
