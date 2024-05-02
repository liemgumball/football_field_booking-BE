import z from 'zod'

export const LongitudeSchema = z.number().min(-180).max(180)

export const LatitudeSchema = z.number().min(-90).max(90)

export const PointSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([LongitudeSchema, LatitudeSchema]),
})

export const LocationSchema = z.object({
  name: z.string().trim().min(10, 'Address too short'),
  geo: PointSchema,
})
