import z from 'zod'
import { DateSchema, TimeStepSchema, ValidIdSchema } from './common.schema'
import { getDateFromTimeStep, getIndexOfTimeStep } from '@src/util/timestep'
import { getNext15Minutes, getToday } from '@src/util/date'

// Your other schemas and functions (ValidIdSchema, TimeStepSchema, getNext15Minutes, getIndexOfTimeStep) are assumed to be defined elsewhere.

const BookingSchema = z.object({
  name: z.string().trim().optional(),
  userId: ValidIdSchema,
  subfieldId: ValidIdSchema,
  date: DateSchema.refine(
    (val) => val >= getToday(),
    'Booking date must as least from: ' + getToday().toISOString(),
  ),
  from: TimeStepSchema,
  to: TimeStepSchema,
  price: z.number().int().min(0),
  description: z.string().optional(),
})

export const createBookingSchema = z.object({
  body: BookingSchema.refine(({ date, from }) => {
    return getDateFromTimeStep(date, from) >= getNext15Minutes()
  }, 'Booking must as least 15 minutes from now.').refine(({ from, to }) => {
    return getIndexOfTimeStep(to) - getIndexOfTimeStep(from) >= 2 // check if `to - from` is at least 1 hour
  }, 'Booking time must longs at least 1 hour.'),
})

export const updateBookingSchema = z.object({
  params: z.object({
    id: ValidIdSchema,
  }),
  body: z
    .object({
      canceled: z.boolean().refine((val) => val, 'Only accept true'),
    })
    .or(
      z.object({
        confirmed: z.boolean().refine((val) => val, 'Only accept true'),
      }),
    )
    .or(
      z.object({
        review: z.object({
          rating: z.number().int().min(1).max(5),
          description: z.string().optional(),
        }),
      }),
    ),
})
