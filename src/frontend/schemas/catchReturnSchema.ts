import { z } from 'zod'
import { catchReturnReturnSchema } from './catchReturnReturnSchema'

export const catchReturnSchema = z.object({
  booking: z.number().optional().nullable(),
  returnCompleted: z.boolean(),
  nilReturn: z.boolean(),
  publicId: z.string(),
  stats: z.object({
    total: z.number(),
    averageLength: z.number(),
    largeFish: z.number(),
  }),
  returns: z.array(catchReturnReturnSchema),
})

export type CatchReturn = z.infer<typeof catchReturnSchema>
