import z from 'zod'
import { isValidObjectId } from 'mongoose'

export const ValidIdSchema = z
  .string()
  .trim()
  .refine((value) => isValidObjectId(value), {
    message: 'Invalid Id',
  })

export const withValidIdSchema = z.object({
  params: z.object({
    id: ValidIdSchema,
  }),
})

export const TimeStepSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, 'Invalid time format, must be in HH:MM format')
  .min(5) // Ensure minimum length is 5 characters (HH:MM)
  .max(5) // Ensure maximum length is 5 characters (HH:MM)
  .refine(
    (value) => {
      const [hour, minute] = value.split(':')
      return (
        parseInt(hour, 10) >= 0 &&
        parseInt(hour, 10) <= 23 &&
        (parseInt(minute, 10) === 0 || parseInt(minute, 10) === 30)
      )
    },
    { message: 'HH must from 00 to 23 & MM must either 00 or 30' },
  )

export const DateSchema = z
  .string()
  .trim()
  .transform((val) => new Date(val))
  .refine(
    (val) =>
      val.getUTCHours() === 0 &&
      val.getUTCMinutes() === 0 &&
      val.getUTCMilliseconds() === 0,
    'Date must ends with T00:00:00.000Z',
  )
