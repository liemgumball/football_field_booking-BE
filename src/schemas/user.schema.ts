import { PHONE_NUMBER_REGEX } from '@src/constants/Regex'
import { object, string } from 'zod'

/**
 * Schema for POST user requests
 */
export const createUserSchema = object({
  body: object({
    password: string({
      required_error: 'Password is required',
    }).min(6, 'Password too short - should be 6 chars minimum'),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
    phone_number: string({
      required_error: 'Phone number is required',
    }).regex(PHONE_NUMBER_REGEX, 'Invalid phone number'),
  }),
})

/**
 * Schema for PATCH user requests
 */
export const updateUserSchema = object({
  body: object({
    phone_number: string().regex(PHONE_NUMBER_REGEX, 'Invalid phone number'),
    name: string(),
    avatar: string().url('Invalid url').optional(),
  }),
})
