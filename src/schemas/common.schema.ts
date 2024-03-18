import { isValidObjectId } from 'mongoose'
import { object, string } from 'zod'

export const validIdSchema = object({
  params: object({
    id: string().refine((value) => isValidObjectId(value), {
      message: 'Invalid Id',
    }),
  }),
})
