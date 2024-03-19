import { array, literal, number, object, string } from 'zod'

export const LocationSchema = object({
  name: string(),
  type: literal('Point'),
  coordinates: array(number()).length(2),
})
