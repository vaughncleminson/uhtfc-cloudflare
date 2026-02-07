import { array, z } from 'zod'
import { lineItemSchema } from './lineItemSchema'

export const membershipSchema = z.object({
  productType: z.string(),
  userId: z.number(),
  membershipType: z
    .enum(['select', 'OM', 'OMW', 'F', 'J', 'S', 'C'])
    .refine((val) => val !== 'select', {
      message: 'Please select a valid membership type.',
    }),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  idNumber: z.string().min(1, 'ID number is required'),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  totalAmount: z.number().default(0),
  lineItems: array(lineItemSchema).min(1, { message: 'At least 1 line item is required' }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
})
export type Membership = z.infer<typeof membershipSchema>
