import { z } from 'zod'

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    mobileNumber: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
    idNumber: z.string().regex(/^\d{13}$/, 'ID number must be at least 13 digits'),
    physicalAddress: z.string().min(1, 'Physical address is required'),
    vehicles: z.array(
      z.object({
        vehicleModel: z.string().min(1, 'Required'),
        vehicleRegistration: z.string().min(1, 'Required'),
        vehicleColour: z.string().min(1, 'Required'),
      }),
    ),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})
