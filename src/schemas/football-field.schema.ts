import {
  LatitudeSchema,
  LocationSchema,
  LongitudeSchema,
} from '@src/schemas/location.schema'
import { isValidObjectId } from 'mongoose'
import { object, string, number, array, boolean } from 'zod'
import { userSchema } from './user.schema'

const SubFieldSchema = object({
  name: string(),
  size: number().min(5).max(11),
  availability: boolean(),
  defaultPrice: number(),
})

const TimeSchema = string()
  .regex(/^\d{2}:\d{2}$/)
  .min(5) // Ensure minimum length is 5 characters (HH:MM)
  .max(5) // Ensure maximum length is 5 characters (HH:MM)
  .refine(
    (value) => {
      const [hour, minute] = value.split(':')
      return (
        parseInt(hour, 10) >= 0 &&
        parseInt(hour, 10) <= 23 &&
        parseInt(minute, 10) >= 0 &&
        parseInt(minute, 10) <= 59
      )
    },
    { message: 'Invalid time format, must be in HH:MM format' },
  )

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
  openedAt: TimeSchema,
  closedAt: TimeSchema,
  rating: number().min(0).max(5).optional(),
  images: array(string()).optional(),
})

export const createFootballFieldSchema = object({
  body: object({
    football_field: FootballFieldSchema,
    admin: userSchema,
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

export const getManyFieldsSchema = object({
  query: object({
    longitude: LongitudeSchema,
    latitude: LatitudeSchema,
    distance: number().optional(),
  }).optional(),
})
