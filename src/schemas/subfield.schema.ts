import z from 'zod'
import { ValidIdSchema } from './common.schema'

const SubFieldSchema = z.object({
  name: z.string().trim(),
  size: z.enum(['5', '6', '7', '11']),
  availability: z.boolean().optional(),
  defaultPrice: z.number().int().min(0),
})

export const createSubFieldSchema = z.object({
  params: z.object({
    fieldId: ValidIdSchema,
  }),
  body: SubFieldSchema,
})

export const updateSubFieldSchema = z.object({
  params: z.object({
    fieldId: ValidIdSchema,
    id: ValidIdSchema,
  }),
  body: SubFieldSchema.partial(),
})
