import { array, boolean, number, object, string } from 'zod'
import { TimeStepSchema, ValidIdSchema } from './common.schema'
import { getNextMonth, getTomorrow } from '@src/util/date'

const TurnOfServiceSchema = object({
  at: TimeStepSchema,
  price: number().int().min(0).optional(),
  availability: boolean().optional(),
  user: ValidIdSchema.optional(),
})

const DayOfServiceSchema = object({
  fieldId: ValidIdSchema,
  subfieldId: ValidIdSchema,
  date: string()
    .transform((value) => new Date(value))
    .refine((val) => val >= getTomorrow() && val <= getNextMonth()),
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
      .transform((val) => +val)
      .refine(
        (val) => val >= -180 && val <= 180,
        'Longitude must be between 1-80 and 180',
      )
      .optional(),
    latitude: string()
      .transform((val) => +val)
      .refine(
        (val) => val >= -90 && val <= 90,
        'Latitude must be between -90 and 90',
      )
      .optional(),
  }).passthrough(),
})
