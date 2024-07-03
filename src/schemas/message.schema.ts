import z from 'zod'
import { ValidIdSchema } from './common.schema'

const MessageSchema = z.object({
  receiverId: ValidIdSchema,
  message: z.string(),
})

export const createMessageSchema = z.object({
  body: MessageSchema,
})
