import { Router } from 'express'

// Constants
import Paths from '@src/constants/Paths'
import HttpStatusCodes from '@src/constants/HttpStatusCodes'

// Schemas
import { createUserSchema, updateUserSchema } from '@src/schemas/user.schema'

// Controller
import UserController from '@src/controllers/user.controller'

// Validator
import zValidate from '@src/middlewares/validateResource'
import jValidator from 'jet-validator'
const jValidate = jValidator(HttpStatusCodes.BAD_GATEWAY)

const userRouter = Router()

userRouter.get('', UserController.getAll)

userRouter.get(
  Paths.USERS.GET,
  jValidate(['id', 'string', 'params']),
  UserController.getById,
)

userRouter.post(
  Paths.USERS.ADD,
  zValidate(createUserSchema),
  UserController.add,
)

userRouter.delete(
  Paths.USERS.DELETE,
  jValidate(['id', 'string', 'params']),
  UserController.delete,
)

userRouter.patch(
  Paths.USERS.UPDATE,
  jValidate(['id', 'string', 'params']),
  zValidate(updateUserSchema),
  UserController.update,
)

export default userRouter
