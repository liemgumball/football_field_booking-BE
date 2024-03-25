import { array, boolean, number, object, string } from 'zod'
import { TimeStepSchema, ValidIdSchema } from './common.schema'

// Tomorrow
const Tomorrow = new Date()
Tomorrow.setDate(Tomorrow.getDate() + 1)

// Next Month
const NextMonth = new Date()
NextMonth.setMonth(NextMonth.getMonth() + 1)

const TurnOfServiceSchema = object({
  at: TimeStepSchema,
  price: number().int().min(0).optional(),
  isUsed: boolean().optional(),
  user: ValidIdSchema.optional(),
})

const DayOfServiceSchema = object({
  fieldId: ValidIdSchema,
  subfieldId: ValidIdSchema,
  date: string()
    .transform((value) => new Date(value))
    .refine((val) => {
      const dateValue = val instanceof Date ? val : new Date(val)
      return dateValue >= Tomorrow && dateValue <= NextMonth
    }),
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

export const getDayOfServiceByFieldIdSchema = object({
  params: object({
    fieldId: ValidIdSchema,
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
