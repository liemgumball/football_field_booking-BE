import { TReview } from '@src/types'
import { Schema, model } from 'mongoose'
import { Document } from 'mongoose'
import LocationModel from './location.model'

type ReviewDocument = TReview & Document

const ReviewSchema = new Schema<ReviewDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true,
    index: true,
  },
  fieldId: {
    type: Schema.Types.ObjectId,
    ref: 'FootballField',
    required: true,
    immutable: true,
    index: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  description: String,
})

ReviewSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  options: {
    projection: { password: 0, createdAt: 0, updatedAt: 0, role: 0, __v: 0 },
  },
})

ReviewSchema.virtual('field', {
  ref: 'FootballField',
  localField: 'fieldId',
  foreignField: '_id',
  justOne: true,
  options: {
    projection: {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
      adminId: 0,
      subfieldIds: 0,
    },
    populate: {
      path: 'location',
      model: LocationModel,
      localField: '_id',
      foreignField: '_id',
      select: '-_id -geo.type -__v',
    },
  },
})

// Apply the virtual to the schema
ReviewSchema.set('toObject', { virtuals: true })
ReviewSchema.set('toJSON', { virtuals: true })

const ReviewModel = model<ReviewDocument>('Review', ReviewSchema)

export default ReviewModel
