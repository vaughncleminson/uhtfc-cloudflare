import { z } from 'zod'

export const lineItemSchema = z.object({
  displayName: z.string(),
  description: z.string(),
  quantity: z.number(),
  price: z.number(),
})

export type LineItem = z.infer<typeof lineItemSchema>

export const YocoLineItemSchema = z.object({
  displayName: z.string(),
  description: z.string(),
  quantity: z.number(),
  pricingDetails: z.object({ price: z.number() }),
})

export type YocoLineItem = z.infer<typeof YocoLineItemSchema>
