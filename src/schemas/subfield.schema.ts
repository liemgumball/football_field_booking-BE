import { boolean, number, object, string } from 'zod'
import { ValidIdSchema } from './common.schema'

const SubFieldSchema = object({
  name: string(),
  size: number().int().min(5).max(11),
  availability: boolean().optional(),
  defaultPrice: number().int().min(0),
})

export const createSubFieldSchema = object({
  params: object({
    fieldId: ValidIdSchema,
  }),
  body: SubFieldSchema,
})

export const updateSubFieldSchema = object({
  params: object({
    fieldId: ValidIdSchema,
    id: ValidIdSchema,
  }),
  body: SubFieldSchema.partial(),
})
