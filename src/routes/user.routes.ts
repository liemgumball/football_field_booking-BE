import { Router } from 'express'

// Constants
import Paths from '@src/constants/Paths'
import HttpStatusCodes from '@src/constants/HttpStatusCodes'

// Schemas
import * as Schema from '@src/schemas/user.schema'

// Controller
import * as UserController from '@src/controllers/user.controller'

// Validator
import zValidate from '@src/middlewares/validateResource.middleware'
import jValidator from 'jet-validator'
import validateAuth from '@src/middlewares/auth.middleware'
const jValidate = jValidator(HttpStatusCodes.BAD_GATEWAY)

const userRouter = Router()

userRouter.use(validateAuth)

userRouter.get('', UserController.getAll)

userRouter.get(
  Paths.USERS.GET,
  jValidate(['id', 'string', 'params']),
  UserController.getById,
)

userRouter.delete(
  Paths.USERS.DELETE,
  jValidate(['id', 'string', 'params']),
  UserController.delete_,
)

userRouter.patch(
  Paths.USERS.UPDATE,
  jValidate(['id', 'string', 'params']),
  zValidate(Schema.updateUserSchema),
  UserController.update,
)

export default userRouter
