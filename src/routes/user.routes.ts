import { Router } from 'express'

// Constants
import Paths from '@src/constants/Paths'

// Schemas
import { validIdSchema } from '@src/schemas/common.schema'
import {
  changePasswordSchema,
  updateUserSchema,
} from '@src/schemas/user.schema'

// Controller
import * as UserController from '@src/controllers/user.controller'

// Validator
import { serialize } from '@src/middlewares/serializer.middleware'
import {
  deserializeUser,
  canAccessUserDetails,
} from '@src/middlewares/auth.middleware'

const userRouter = Router()

userRouter.get('', UserController.getAll)

userRouter.use(deserializeUser)

userRouter.get(
  Paths.USERS.GET,
  serialize(validIdSchema),
  canAccessUserDetails,
  UserController.getById,
)

userRouter.delete(
  Paths.USERS.DELETE,
  serialize(validIdSchema),
  canAccessUserDetails,
  UserController.delete_,
)

userRouter.patch(
  Paths.USERS.UPDATE,
  serialize(updateUserSchema),
  canAccessUserDetails,
  UserController.update,
)

userRouter.patch(
  Paths.USERS.CHANGE_PASSWORD,
  canAccessUserDetails,
  serialize(changePasswordSchema),
  UserController.change_password,
)

export default userRouter
