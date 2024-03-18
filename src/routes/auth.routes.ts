import Paths from '@src/constants/Paths'
import { Router } from 'express'

// Controller
import * as authController from '@src/controllers/auth.controller'

// Validator
import zValidate from '@src/middlewares/validateResource.middleware'

// Schemas
import * as Schema from '@src/schemas/user.schema'

const authRouter = Router()

authRouter.post(
  Paths.AUTH.SIGNUP,
  zValidate(Schema.createUserSchema),
  authController.signup,
)

authRouter.post(
  Paths.AUTH.LOGIN,
  zValidate(Schema.loginSchema),
  authController.login,
)

export default authRouter
