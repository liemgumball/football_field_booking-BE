import z from 'zod'
import { ValidIdSchema } from './common.schema'

const ReviewSchema = z.object({
  userId: ValidIdSchema,
  fieldId: ValidIdSchema,
  rating: z.number().min(1).max(5),
  description: z.string().optional(),
})

export const createReviewSchema = z.object({
  body: ReviewSchema,
})

export const updateReviewSchema = z.object({
  params: z.object({
    id: ValidIdSchema,
  }),
  body: ReviewSchema.partial(),
})
