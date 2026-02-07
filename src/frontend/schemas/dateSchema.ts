import { z } from 'zod'

export const dateSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: 'Invalid date format',
})
