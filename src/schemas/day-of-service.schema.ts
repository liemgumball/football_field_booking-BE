import { array, boolean, number, object, string, enum as enum_ } from 'zod'
import { DateSchema, TimeStepSchema, ValidIdSchema } from './common.schema'
import { getNextMonth, getToday } from '@src/util/date'

const TurnOfServiceSchema = object({
  at: TimeStepSchema,
  price: number().int().min(0).optional(),
  availability: boolean().optional(),
  user: ValidIdSchema.optional(),
})

const DayOfServiceSchema = object({
  fieldId: ValidIdSchema,
  subfieldId: ValidIdSchema,
  date: DateSchema.refine(
    (val) => val >= getToday() && val <= getNextMonth(),
    'Date must be between today and next month',
  ),
  availability: boolean().optional(),
  turnOfServices: array(TurnOfServiceSchema)
    .max(48)
    .refine((turnOfServices) => {
      // Check each turnOfService against TurnOfServiceSchema
      for (const turnOfService of turnOfServices) {
        const validationResult = TurnOfServiceSchema.safeParse(turnOfService)
        if (!validationResult.success) {
          return false // If any turnOfService doesn't match TurnOfServiceSchema, return false
        }
      }
      return true // All turnOfServices match TurnOfServiceSchema
    }),
})

export const getDayOfServiceSchema = object({
  params: object({
    id: ValidIdSchema,
  }),
  query: object({
    from: TimeStepSchema.optional(),
    to: TimeStepSchema.optional(),
  }),
})

export const updateDayOfServiceSchema = object({
  params: object({
    fieldId: ValidIdSchema,
    id: ValidIdSchema,
  }),
  body: DayOfServiceSchema.pick({ turnOfServices: true })
    .strict()
    .or(DayOfServiceSchema.omit({ turnOfServices: true }).partial().strict()),
})

export const searchDayOfServiceSchema = object({
  query: object({
    longitude: string()
      .trim()
      .transform((val) => +val)
      .refine(
        (val) => val >= -180 && val <= 180,
        'Longitude must be between -180 and 180',
      )
      .optional(),
    latitude: string()
      .trim()
      .transform((val) => +val)
      .refine(
        (val) => val >= -90 && val <= 90,
        'Latitude must be between -90 and 90',
      )
      .optional(),
    date: DateSchema,
    from: TimeStepSchema,
    to: TimeStepSchema.optional(),
    size: enum_(['5', '6', '7', '11']).optional(),
    cursor: string()
      .trim()
      .transform((val) => parseInt(val))
      .optional(),
  }).passthrough(),
})
