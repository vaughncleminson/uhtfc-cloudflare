import type { Field } from 'payload'

export const LineItems: Field = {
  type: 'array',
  name: 'lineItems',
  label: 'Line Items',
  fields: [
    {
      type: 'text',
      name: 'displayName',
      label: 'Display Name',
      required: true,
    },
    {
      type: 'text',
      name: 'description',
      label: 'Description',
      required: true,
    },
    {
      type: 'number',
      name: 'quantity',
      label: 'Quantity',
      required: true,
    },
    {
      type: 'number',
      name: 'price',
      label: 'Price',
      required: true,
    },
  ],
}
