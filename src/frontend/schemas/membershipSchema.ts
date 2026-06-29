import { array, z } from 'zod'
import { lineItemSchema } from './lineItemSchema'

export const membershipSchema = z.object({
  productType: z.string(),
  userId: z.number(),
  orderId: z.number().optional(),
  membershipType: z.enum(['select', 'OM', 'OMW', 'F', 'J', 'S']).refine((val) => val !== 'select', {
    message: 'Please select a valid membership type.',
  }),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  idNumber: z.string().min(1, 'ID number is required'),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
  physicalAddress: z.string().min(1, 'Physical address is required'),
  vehicles: z.array(
    z.object({
      vehicleModel: z.string().min(1, 'Required'),
      vehicleRegistration: z.string().min(1, 'Required'),
      vehicleColour: z.string().min(1, 'Required'),
    }),
  ),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
  howDidYouHearAboutUs: z.string().optional(),
  otherMemberships: z.string().optional(),
  totalAmount: z.number().default(0),
  lineItems: array(lineItemSchema).min(1, { message: 'At least 1 line item is required' }),
})
export type Membership = z.infer<typeof membershipSchema>
