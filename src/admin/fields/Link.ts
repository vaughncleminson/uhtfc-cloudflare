import type { Field } from 'payload'

import deepMerge from '@/admin/utils/deepMerge'

export type LinkAppearances = 'default' | 'outline'

export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
  default: {
    label: 'Default',
    value: 'default',
  },
  outline: {
    label: 'Outline',
    value: 'outline',
  },
}

type LinkType = (options?: { disableLabel?: boolean; overrides?: Record<string, unknown> }) => Field

export const Link: LinkType = ({ disableLabel = false, overrides = {} } = {}) => {
  const linkResult: Field = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: 'Open in new tab',
          },
          {
            name: 'show',
            type: 'select',
            label: 'Visibility',
            defaultValue: 'always',
            options: [
              {
                label: 'Always',
                value: 'always',
              },
              {
                label: 'Authenticated',
                value: 'auth',
              },
              {
                label: 'Unauthenticated',
                value: 'no-auth',
              },
            ],
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'internalLink',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Internal Link',
      // required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      // required: true,
    },
  ]

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: '50%',
      },
    }))

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Label',
          // required: true,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  return deepMerge(linkResult, overrides)
}
