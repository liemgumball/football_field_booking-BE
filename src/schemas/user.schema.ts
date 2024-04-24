import { PHONE_NUMBER_REGEX } from '@src/constants/Regex'
import { object, string } from 'zod'
import { ValidIdSchema } from './common.schema'

export const UserSchema = object({
  password: string({
    required_error: 'Password is required',
  }).min(6, 'Password too short - should be 6 chars minimum'),
  email: string({
    required_error: 'Email is required',
  })
    .trim()
    .email('Not a valid email'),
  phoneNumber: string({
    required_error: 'Phone number is required',
  })
    .trim()
    .regex(PHONE_NUMBER_REGEX, 'Invalid phone number'),
  name: string().trim().optional(),
  avatar: string().trim().url('Invalid url').optional(),
})

/**
 * Schema for POST user requests
 */
export const createUserSchema = object({
  body: UserSchema.strict(),
})

/**
 * Schema for PATCH user requests
 */
export const updateUserSchema = object({
  params: object({
    id: ValidIdSchema,
  }),
  body: UserSchema.omit({ email: true, password: true }).partial(),
})

export const loginSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email'),
    password: string({ required_error: 'Password is required' }).min(
      6,
      'Password too short - should be 6 chars minimum',
    ),
  }),
})

export const changePasswordSchema = object({
  body: object({
    email: string().trim().email(),
    old_password: string().min(6, {
      message: 'Password too short - should be 6 chars minimum',
    }),
    new_password: string().min(6, {
      message: 'Password too short - should be 6 chars minimum',
    }),
  }).refine(({ old_password, new_password }) => old_password !== new_password, {
    message: 'Old and new passwords must be different',
    path: ['old_password', 'new_password'],
  }),
})
