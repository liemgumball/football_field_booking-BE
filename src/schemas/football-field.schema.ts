import { PHONE_NUMBER_REGEX } from '@src/constants/Regex'
import { LocationSchema } from '@src/schemas/location.schema'
import { isValidObjectId } from 'mongoose'
import { object, string, number, array, boolean } from 'zod'

const SubFieldSchema = object({
  name: string(),
  size: number().min(5).max(11),
  availability: boolean(),
  defaultPrice: number(),
})

const TimeSchema = object({
  hour: number().int().min(0).max(23),
  minute: number().int().min(0).max(59),
})

/**
 * Represents the schema for a football field.
 *
 * @example
 * const exampleData = {
 *   name: 'Soccer Field Park',
 *   location: {
 *     name: '123 Main St, City, Country',
 *     type: 'Point',
 *     coordinates: [37.7749, -122.4194],
 *   },
 *   subfields: [
 *     {
 *       name: 'Field A',
 *       size: 11,
 *       availability: true,
 *       defaultPrice: 50,
 *     },
 *     {
 *       name: 'Field B',
 *       size: 7,
 *       availability: false,
 *       defaultPrice: 40,
 *     },
 *   ],
 *   opened_at: {
 *     hour: 8,
 *     minute: 0,
 *   },
 *   closed_at: {
 *     hour: 22,
 *     minute: 30,
 *   },
 *   rating: 4.5,
 *   images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
 * };
 *
 */
const FootballFieldSchema = object({
  name: string(),
  location: LocationSchema,
  subfields: array(SubFieldSchema),
  opened_at: TimeSchema,
  closed_at: TimeSchema,
  rating: number().min(0).max(5).optional(),
  images: array(string()).optional(),
})

export const createFootballFieldSchema = object({
  body: object({
    football_field: FootballFieldSchema,
    admin: object({
      email: string().email(),
      password: string({
        required_error: 'Password is required',
      }).min(6, 'Password too short - should be 6 chars minimum'),
      phone_number: string({
        required_error: 'Phone number is required',
      }).regex(PHONE_NUMBER_REGEX, 'Invalid phone number format'),
    }),
  }),
})

export const updateFieldSchema = object({
  params: object({
    id: string().refine((value) => isValidObjectId(value), {
      message: 'Invalid Id',
    }),
  }),
  body: FootballFieldSchema.partial(),
})
