import Paths from '@src/constants/Paths'
import { Router } from 'express'

// Controller
import * as AuthController from '@src/controllers/auth.controller'

// Validator
import { serialize } from '@src/middlewares/serializer.middleware'

// Schemas
import * as Schema from '@src/schemas/user.schema'

const authRouter = Router()

authRouter.post(
  Paths.AUTH.SIGNUP,
  serialize(Schema.createUserSchema),
  AuthController.signup,
)

authRouter.post(
  Paths.AUTH.LOGIN,
  serialize(Schema.loginSchema),
  AuthController.login,
)

export default authRouter
