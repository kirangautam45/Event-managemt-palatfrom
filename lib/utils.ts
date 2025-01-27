import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import { UserRole } from '@prisma/client'

const passwordRegexes = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*()]/,
}

export const authFormSchema = () =>
  z.object({
    // sign up
    role: z.nativeEnum(UserRole).optional(),
    //both
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password must be less than 64 characters')
      .refine((pwd) => passwordRegexes.uppercase.test(pwd), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((pwd) => passwordRegexes.lowercase.test(pwd), {
        message: 'Password must contain at least one lowercase letter',
      })
      .refine((pwd) => passwordRegexes.number.test(pwd), {
        message: 'Password must contain at least one number',
      })
      .refine((pwd) => passwordRegexes.special.test(pwd), {
        message: 'Password must contain at least one special character',
      }),
  })

export const EventSchema = () =>
  z.object({
    id: z.string().optional(),
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
    location: z.string().min(3, 'Location must be at least 3 characters'),
  })

 