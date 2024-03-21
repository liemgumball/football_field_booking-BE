import { PHONE_NUMBER_REGEX } from '@src/constants/Regex'
import { isValidObjectId } from 'mongoose'
import { object, string } from 'zod'

export const userSchema = object({
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
  body: userSchema,
})

/**
 * Schema for PATCH user requests
 */
export const updateUserSchema = object({
  params: object({
    id: string().refine((value) => isValidObjectId(value), {
      message: 'Invalid Id',
    }),
  }),
  body: userSchema.partial(),
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
