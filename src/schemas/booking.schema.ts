import { boolean, number, object, string } from 'zod'
import { TimeStepSchema, ValidIdSchema } from './common.schema'
import {
  getDateFromTimeStep,
  getIndexOfTimeStep,
  getNextHour,
} from '@src/util/timestep'

// Your other schemas and functions (ValidIdSchema, TimeStepSchema, getNextHour, getIndexOfTimeStep) are assumed to be defined elsewhere.

const BookingSchema = object({
  userId: ValidIdSchema,
  subfieldId: ValidIdSchema,
  date: string()
    .transform((val) => new Date(val))
    .refine((val) => {
      return val.getUTCHours() === 0 && val.getUTCMinutes() === 0
    }, 'UTC Date must ends with T00:00:00.000Z'),
  from: TimeStepSchema,
  to: TimeStepSchema,
  price: number().int().min(0),
})

export const createBookingSchema = object({
  body: BookingSchema.refine(
    ({ date, from }) => getDateFromTimeStep(date, from) >= getNextHour(),
    'Booking must as least 1 hour from now',
  ).refine(({ from, to }) => {
    return getIndexOfTimeStep(to) - getIndexOfTimeStep(from) >= 2 // check if `to - from` is at least 1 hour
  }, 'Invalid booking time. Booking time must longs at least 1 hour'),
})

export const cancelBookingSchema = object({
  params: object({
    id: ValidIdSchema,
  }),
  body: object({
    canceled: boolean().refine((val) => val, 'Only accept true'),
  }),
})

export const confirmBookingSchema = object({
  params: object({
    id: ValidIdSchema,
  }),
  body: object({
    confirmed: boolean().refine((val) => val, 'Only accept true'),
  }),
})
