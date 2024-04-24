import { boolean, number, object, string } from 'zod'
import { DateSchema, TimeStepSchema, ValidIdSchema } from './common.schema'
import { getDateFromTimeStep, getIndexOfTimeStep } from '@src/util/timestep'
import { getNextHour, getToday } from '@src/util/date'

// Your other schemas and functions (ValidIdSchema, TimeStepSchema, getNextHour, getIndexOfTimeStep) are assumed to be defined elsewhere.

const BookingSchema = object({
  name: string().trim().optional(),
  userId: ValidIdSchema,
  subfieldId: ValidIdSchema,
  date: DateSchema.refine(
    (val) => val >= getToday(),
    'Booking date must as least from' + getToday().toLocaleDateString(),
  ),
  from: TimeStepSchema,
  to: TimeStepSchema,
  price: number().int().min(0),
  description: string().optional(),
})

export const createBookingSchema = object({
  body: BookingSchema.refine(
    ({ date, from }) => getDateFromTimeStep(date, from) >= getNextHour(),
    'Booking must as least 1 hour from now.',
  ).refine(({ from, to }) => {
    return getIndexOfTimeStep(to) - getIndexOfTimeStep(from) >= 2 // check if `to - from` is at least 1 hour
  }, 'Booking time must longs at least 1 hour.'),
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
