import z from 'zod'
import { PHONE_NUMBER_REGEX } from '@src/constants/Regex'
import { ValidIdSchema } from './common.schema'

export const UserSchema = z.object({
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password too short - should be 6 chars minimum'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .trim()
    .email('Not a valid email'),
  phoneNumber: z
    .string({
      required_error: 'Phone number is required',
    })
    .trim()
    .regex(PHONE_NUMBER_REGEX, 'Invalid phone number'),
  name: z.string().trim().optional(),
  avatar: z.string().trim().url('Invalid url').optional(),
})

/**
 * Schema for POST user requests
 */
export const createUserSchema = z.object({
  body: UserSchema.strict(),
})

/**
 * Schema for PATCH user requests
 */
export const updateUserSchema = z.object({
  params: z.object({
    id: ValidIdSchema,
  }),
  body: UserSchema.omit({ email: true, password: true }).partial(),
})

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password too short - should be 6 chars minimum'),
  }),
})

export const changePasswordSchema = z.object({
  body: z
    .object({
      email: z.string().trim().email(),
      oldPassword: z.string().min(6, {
        message: 'Password too short - should be 6 chars minimum',
      }),
      newPassword: z.string().min(6, {
        message: 'Password too short - should be 6 chars minimum',
      }),
    })
    .refine(({ oldPassword, newPassword }) => oldPassword !== newPassword, {
      message: 'Old and new passwords must be different',
      path: ['old_password', 'new_password'],
    }),
})

export const resendEmailVerifySchema = z.object({
  body: z.object({ email: z.string().email() }),
})

export const googleLoginSchema = z.object({
  body: z.object({
    credential: z.string(),
  }),
})
