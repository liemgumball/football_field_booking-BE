import { Router } from 'express'

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

// userRouter.get('', UserController.getAll)

// Authentication
userRouter.use(deserializeUser)

//------------------------- Only exact User can access -------------------------
userRouter.get(
  '/:id',
  canAccessUserDetails,
  serialize(withValidIdSchema),
  UserController.getById,
)

userRouter.patch(
  '/:id',
  canAccessUserDetails,
  serialize(updateUserSchema),
  UserController.update,
)

userRouter.patch(
  '/change-password/:id',
  canAccessUserDetails,
  serialize(changePasswordSchema),
  UserController.change_password,
)

// ------------------------- Only Super User can access ------------------------
userRouter.delete(
  '/:id',
  isSuperUser,
  serialize(withValidIdSchema),
  UserController.delete_,
)

export default userRouter
