import { z } from 'zod'

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    mobileNumber: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    'confirm-password': z.string(),
  })
  .refine((data) => data.password === data['confirm-password'], {
    message: 'Passwords do not match',
    path: ['confirm-password'],
  })

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})
