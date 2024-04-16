import { boolean, number, object, string, enum as enum_ } from 'zod'
import { ValidIdSchema } from './common.schema'

const SubFieldSchema = object({
  name: string(),
  size: enum_(['5', '6', '7', '11']),
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
