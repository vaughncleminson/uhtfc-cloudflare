import { array, z } from 'zod'
import { dateSchema } from './dateSchema'
import { lineItemSchema } from './lineItemSchema'

// userId?: number | null | undefined
//   fullName?: string | null | undefined
//   firstName?: string | null | undefined
//   lastName?: string | null | undefined
//   email?: string | null | undefined
//   role?: 'non-member' | 'member' | 'member-guest' | 'corporate-guest' | 'admin' | null | undefined
const anglerSchema = z.object({
  fullName: z.string().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  email: z.string().email('Invalid email address').optional().nullable(),
  role: z.string().optional().nullable(),
})

export const bookingSchema = z.object({
  productType: z.string(),
  userId: z.number(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  role: z.string(),
  email: z.string().email('Invalid email address'),
  location: z.number().min(0, { message: 'Please select a location' }),
  locationName: z.string(),
  date: dateSchema,
  anglers: array(anglerSchema).min(1, { message: 'At least 1 angler required' }),
  totalAmount: z.number().default(0),
  lineItems: array(lineItemSchema).min(1, { message: 'At least 1 line item is required' }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
})

export type Booking = z.infer<typeof bookingSchema>
