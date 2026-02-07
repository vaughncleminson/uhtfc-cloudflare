import type { ArrayField, Field } from 'payload'

import type { LinkAppearances } from './Link'

import { Link } from './Link'

type LinkGroupType = (options?: {
  appearances?: LinkAppearances[] | false
  overrides?: Partial<ArrayField>
}) => Field

export const linkGroup: LinkGroupType = () => {
  const generatedLinkGroup: Field = {
    name: 'links',
    type: 'array',
    fields: [Link()],
    admin: {
      initCollapsed: true,
    },
  }

  return generatedLinkGroup
}
