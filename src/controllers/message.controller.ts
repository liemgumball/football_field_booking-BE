import { IReq, IRes } from '@src/types/express/misc'

import * as MessageService from '@src/services/message.service'
import * as UserService from '@src/services/user.service'

import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { TMessage } from '@src/types'
import { Types } from 'mongoose'

export async function getMessages(req: IReq, res: IRes) {
  const { receiverId } = req.params

  const senderId = req.user?._id

  if (!senderId) return res.status(HttpStatusCodes.UNAUTHORIZED).end()

  const messages = await MessageService.getMessage(senderId, receiverId)

  return res.status(HttpStatusCodes.OK).json(messages)
}

export async function createMessage(
  req: IReq<Omit<TMessage, '_id' | 'senderId'>>,
  res: IRes,
) {
  const { receiverId, message } = req.body

  const senderId = req.user?._id

  if (!senderId) return res.status(HttpStatusCodes.UNAUTHORIZED).end()

  const sender = await UserService.getById(senderId as unknown as string)
  const receiver = await UserService.getById(receiverId as unknown as string)

  if (!sender || !receiver)
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send('Invalid sender or receiver')

  await MessageService.createMessage({
    message,
    receiverId,
    senderId: senderId as unknown as Types.ObjectId,
  })

  return res.status(HttpStatusCodes.CREATED).end()
}
