import { literal, number, object, string, tuple } from 'zod'

export const LongitudeSchema = number().min(-180).max(180)

export const LatitudeSchema = number().min(-90).max(90)

export const PointSchema = object({
  type: literal('Point'),
  coordinates: tuple([LongitudeSchema, LatitudeSchema]),
})

export const LocationSchema = object({
  name: string(),
  geo: PointSchema,
})
