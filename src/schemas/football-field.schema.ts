import {
  LatitudeSchema,
  LocationSchema,
  LongitudeSchema,
} from '@src/schemas/location.schema'
import { object, string, number, array } from 'zod'
import { UserSchema } from './user.schema'
import { TimeStepSchema, ValidIdSchema } from './common.schema'

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
  openedAt: TimeStepSchema,
  closedAt: TimeStepSchema,
  rating: number().min(0).max(5).optional(),
  images: array(string()).optional(),
})

export const createFootballFieldSchema = object({
  body: object({
    football_field: FootballFieldSchema,
    admin: UserSchema,
  }),
})

export const updateFieldSchema = object({
  params: object({
    id: ValidIdSchema,
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
