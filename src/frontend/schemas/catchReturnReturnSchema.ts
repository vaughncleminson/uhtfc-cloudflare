import { z } from 'zod'

export const catchReturnReturnSchema = z.object({
  species: z.string(),
  length: z.number(),
  released: z.boolean(),
  quantity: z.number(),
})

export type CatchReturnReturn = z.infer<typeof catchReturnReturnSchema>
