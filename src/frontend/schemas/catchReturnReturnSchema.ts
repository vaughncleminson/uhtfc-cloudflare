import { z } from 'zod'

export const catchReturnReturnSchema = z.object({
  species: z.enum(['rainbow', 'brown', 'bass']),
  length: z.number(),
  released: z.boolean(),
  quantity: z.number(),
})

export type CatchReturnReturn = z.infer<typeof catchReturnReturnSchema>
