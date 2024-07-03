import MessageModel from '@src/models/message.model'
import { TMessage } from '@src/types'

export function getMessage(senderId: string, receiverId: string) {
  return MessageModel.find({ senderId: senderId, receiverId: receiverId })
}

export function createMessage(data: Omit<TMessage, '_id'>) {
  return MessageModel.create(data)
}
