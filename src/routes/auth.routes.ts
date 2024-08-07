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

authRouter.post(
  '/login',
  serialize(Schema.loginSchema),
  AuthController.clientLogin,
)

// Login endpoint for admin users
authRouter.post(
  '/login/admin',
  serialize(Schema.loginSchema),
  AuthController.adminLogin,
)

authRouter.get('/verify/:token', AuthController.verify)

authRouter.post(
  '/resend-verify',
  serialize(Schema.resendEmailVerifySchema),
  AuthController.resendEmailVerify,
)

authRouter.post(
  '/reset-password',
  serialize(Schema.resendEmailVerifySchema),
  AuthController.resetPassword,
)

authRouter.post(
  '/change-password',
  serialize(Schema.changePasswordSchema),
  AuthController.changePassword,
)

// GOOGLE AUTHENTICATION
authRouter.post(
  '/google/login',
  serialize(Schema.googleLoginSchema),
  AuthController.googleLogin,
)

export default authRouter
