import { Block } from 'payload'

export const Auth: Block = {
  slug: 'auth',
  interfaceName: 'AuthBlock',
  fields: [
   
    {
      type: 'upload',
      name: 'image',
      label: 'Image',
      relationTo: 'media',
    },
  ],
}
