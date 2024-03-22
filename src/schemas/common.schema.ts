import { isValidObjectId } from 'mongoose'
import { object, string } from 'zod'

export const ValidIdSchema = string().refine(
  (value) => isValidObjectId(value),
  {
    message: 'Invalid Id',
  },
)

export const withValidIdSchema = object({
  params: object({
    id: ValidIdSchema,
  }),
})

export const TimeStepSchema = string()
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
