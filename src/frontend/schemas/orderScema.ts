import { array, z } from 'zod'
import { bookingSchema } from './bookingSchema'
import { lineItemSchema } from './lineItemSchema'
import { membershipSchema } from './membershipSchema'

const roleEnum = z.enum(['admin', 'non-member', 'member', 'member-guest'])
const paymentStatusEnum = z.enum(['not-required', 'payment-pending', 'payment-received'])

export const orderSchema = z.object({
  userId: z.number(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  role: roleEnum,
  email: z.string().email('Invalid email address'),
  products: array(z.union([bookingSchema, membershipSchema])),
  paymentStatus: paymentStatusEnum.optional().nullable(),
  totalAmount: z.number().default(0),
  checkoutId: z.string().optional().nullable(),
  lineItems: array(lineItemSchema).min(1, { message: 'At least 1 line item is required' }),
})

export type Order = z.infer<typeof orderSchema>
