import { Router } from 'express'
import UserController from '@src/controllers/user.controller'
import Paths from '@src/constants/Paths'
import jetValidator from 'jet-validator/lib/jet-validator'
import { isUser } from '@src/models/user.model'

const userRouter = Router()
const validate = jetValidator()

userRouter.get('', UserController.getAll)

userRouter.post(Paths.Users.Add, validate(['user', isUser]), UserController.add)

userRouter.delete(
  Paths.Users.Delete,
  validate(['id', 'string', 'params']),
  UserController.delete,
)

export default userRouter
