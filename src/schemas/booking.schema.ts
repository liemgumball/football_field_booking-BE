import { boolean, number, object, string } from 'zod'
import { TimeStepSchema, ValidIdSchema } from './common.schema'
import { getIndexOfTimeStep } from '@src/util/timestep'

// Your other schemas and functions (ValidIdSchema, TimeStepSchema, getNextHour, getIndexOfTimeStep) are assumed to be defined elsewhere.

const BookingSchema = object({
  userId: ValidIdSchema,
  subfieldId: ValidIdSchema,
  date: string()
    .transform((val) => new Date(val))
    .refine((val) => val.getTime() === 0),
  from: TimeStepSchema,
  to: TimeStepSchema,
  price: number().int().min(0),
})

export const createBookingSchema = object({
  body: BookingSchema.refine(({ from, to }) => {
    return getIndexOfTimeStep(to) - getIndexOfTimeStep(from) >= 2 // check if `to - from` is at least 1 hour
  }, 'Booking time must has at least 1 hour'),
})

export const cancelBookingSchema = object({
  params: object({
    id: ValidIdSchema,
  }),
  body: object({ canceled: boolean() }),
})

export const confirmBookingSchema = object({
  params: object({
    id: ValidIdSchema,
  }),
  body: object({
    confirmed: boolean().refine((val) => val, 'Only accept true'),
  }),
})
