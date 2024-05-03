import z from 'zod'
import { DateSchema, TimeStepSchema, ValidIdSchema } from './common.schema'
import { getDateFromTimeStep, getIndexOfTimeStep } from '@src/util/timestep'
import { getNextHour, getToday } from '@src/util/date'

// Your other schemas and functions (ValidIdSchema, TimeStepSchema, getNextHour, getIndexOfTimeStep) are assumed to be defined elsewhere.

const BookingSchema = z.object({
  name: z.string().trim().optional(),
  userId: ValidIdSchema,
  subfieldId: ValidIdSchema,
  date: DateSchema.refine(
    (val) => val >= getToday(),
    'Booking date must as least from: ' + getToday().toLocaleDateString(),
  ),
  from: TimeStepSchema,
  to: TimeStepSchema,
  price: z.number().int().min(0),
  description: z.string().optional(),
})

export const createBookingSchema = z.object({
  body: BookingSchema.refine(
    ({ date, from }) => getDateFromTimeStep(date, from) >= getNextHour(),
    'Booking must as least 1 hour from now.',
  ).refine(({ from, to }) => {
    return getIndexOfTimeStep(to) - getIndexOfTimeStep(from) >= 2 // check if `to - from` is at least 1 hour
  }, 'Booking time must longs at least 1 hour.'),
})

export const cancelBookingSchema = z.object({
  params: z.object({
    id: ValidIdSchema,
  }),
  body: z.object({
    canceled: z.boolean().refine((val) => val, 'Only accept true'),
  }),
})

export const confirmBookingSchema = z.object({
  params: z.object({
    id: ValidIdSchema,
  }),
  body: z.object({
    confirmed: z.boolean().refine((val) => val, 'Only accept true'),
  }),
})

export const reviewBookingSchema = z.object({
  params: z.object({
    id: ValidIdSchema,
  }),
  body: z.object({
    rating: z.number().int().min(1).max(5),
    description: z.string().optional(),
  }),
})
