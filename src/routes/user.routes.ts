import { Router } from 'express'

// Constants
import Paths from '@src/constants/Paths'

// Schemas
import { validIdSchema } from '@src/schemas/common.schema'
import { updateUserSchema } from '@src/schemas/user.schema'

// Controller
import * as UserController from '@src/controllers/user.controller'

// Validator
import { serialize } from '@src/middlewares/serializer.middleware'
import validateAuth from '@src/middlewares/auth.middleware'

const userRouter = Router()

userRouter.use(validateAuth)

userRouter.get('', UserController.getAll)

userRouter.get(
  Paths.USERS.GET,
  serialize(validIdSchema),
  UserController.getById,
)

userRouter.delete(
  Paths.USERS.DELETE,
  serialize(validIdSchema),
  UserController.delete_,
)

userRouter.patch(
  Paths.USERS.UPDATE,
  serialize(updateUserSchema),
  UserController.update,
)

export default userRouter
