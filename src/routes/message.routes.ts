import { Router } from 'express'

// Controller
import * as MessageController from '@src/controllers/message.controller'
import { deserializeUser } from '@src/middlewares/auth.middleware'
import { createMessageSchema } from '@src/schemas/message.schema'
import { serialize } from '@src/middlewares/serializer.middleware'

const messageRouter = Router()

// Authentication
messageRouter.use(deserializeUser)

messageRouter.get('/:receiverId', MessageController.getMessages)

messageRouter.post(
  '',
  serialize(createMessageSchema),
  MessageController.createMessage,
)

export default messageRouter
