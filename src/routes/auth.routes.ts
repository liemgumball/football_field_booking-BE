import { Router } from 'express'

// Controller
import * as AuthController from '@src/controllers/auth.controller'

// Validator
import { serialize } from '@src/middlewares/serializer.middleware'

// Schemas
import * as Schema from '@src/schemas/user.schema'

const authRouter = Router()

authRouter.post(
  '/signup',
  serialize(Schema.createUserSchema),
  AuthController.signup,
)

authRouter.post('/login', serialize(Schema.loginSchema), AuthController.login)

authRouter.get('/verify/:token', AuthController.verify)

authRouter.post(
  '/resend-verify',
  serialize(Schema.resendEmailVerifySchema),
  AuthController.resendEmailVerify,
)

export default authRouter
