import { Router } from 'express'

// Constants
import Paths from '@src/constants/Paths'

// Schemas
import {
  changePasswordSchema,
  updateUserSchema,
} from '@src/schemas/user.schema'
import { withValidIdSchema } from '@src/schemas/common.schema'

// Controller
import * as UserController from '@src/controllers/user.controller'

// Validator
import { serialize } from '@src/middlewares/serializer.middleware'
import {
  deserializeUser,
  canAccessUserDetails,
  isSuperUser,
} from '@src/middlewares/auth.middleware'

const userRouter = Router()

userRouter.get('', UserController.getAll)

// Authentication
userRouter.use(deserializeUser)

//------------------------- Only exact User can access -------------------------
userRouter.get(
  Paths.USERS.GET,
  canAccessUserDetails,
  serialize(withValidIdSchema),
  UserController.getById,
)

userRouter.patch(
  Paths.USERS.UPDATE,
  canAccessUserDetails,
  serialize(updateUserSchema),
  UserController.update,
)

userRouter.patch(
  Paths.USERS.CHANGE_PASSWORD,
  canAccessUserDetails,
  serialize(changePasswordSchema),
  UserController.change_password,
)

// ------------------------- Only Super User can access ------------------------
userRouter.delete(
  Paths.USERS.DELETE,
  isSuperUser,
  serialize(withValidIdSchema),
  UserController.delete_,
)

export default userRouter
