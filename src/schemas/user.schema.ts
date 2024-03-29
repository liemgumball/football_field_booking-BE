import { PHONE_NUMBER_REGEX } from '@src/constants/Regex'
import { object, string } from 'zod'
import { ValidIdSchema } from './common.schema'

export const UserSchema = object({
  password: string({
    required_error: 'Password is required',
  }).min(6, 'Password too short - should be 6 chars minimum'),
  email: string({
    required_error: 'Email is required',
  }).email('Not a valid email'),
  phoneNumber: string({
    required_error: 'Phone number is required',
  }).regex(PHONE_NUMBER_REGEX, 'Invalid phone number'),
  name: string().optional(),
  avatar: string().url('Invalid url').optional(),
}).strict()

/**
 * Schema for POST user requests
 */
export const createUserSchema = object({
  body: UserSchema,
})

/**
 * Schema for PATCH user requests
 */
export const updateUserSchema = object({
  params: object({
    id: ValidIdSchema,
  }),
  body: UserSchema.partial(),
})

export const loginSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email',
    ),
    password: string({ required_error: 'Password is required' }).min(
      6,
      'Password too short - should be 6 chars minimum',
    ),
  }),
})

export const changePasswordSchema = object({
  body: object({
    email: string().email(),
    old_password: string({ required_error: 'OLD Password is required' }).min(
      6,
      'Password too short - should be 6 chars minimum',
    ),
    new_password: string({ required_error: 'NEW Password is required' }).min(
      6,
      'Password too short - should be 6 chars minimum',
    ),
  }),
})
