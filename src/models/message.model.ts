import { TMessage } from '@src/types'
import { Document, Schema, model } from 'mongoose'

type MessageDocument = TMessage &
  Document & {
    createdAt: Date
    updatedAt: Date
  }

const MessageSchema = new Schema<MessageDocument>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
      index: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

MessageSchema.virtual('sender', {
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true,
  options: {
    projection: { password: 0, createdAt: 0, updatedAt: 0, role: 0, __v: 0 },
  },
})

MessageSchema.virtual('receiver', {
  ref: 'User',
  localField: 'receiverId',
  foreignField: '_id',
  justOne: true,
  options: {
    projection: { password: 0, createdAt: 0, updatedAt: 0, role: 0, __v: 0 },
  },
})

// Apply the virtual to the schema
MessageSchema.set('toObject', { virtuals: true })
MessageSchema.set('toJSON', { virtuals: true })

const MessageModel = model<MessageDocument>('Message', MessageSchema)

export default MessageModel
