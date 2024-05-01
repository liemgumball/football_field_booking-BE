import { Document, Schema, model } from 'mongoose'
// Types
import { TBooking } from '@src/types'

// Constants
import { HH_MM_REGEX } from '@src/constants/Regex'
import LocationModel from './location.model'

type BookingDocument = TBooking &
  Document & {
    createdAt: Date
    updatedAt: Date
  }

const BookingSchema = new Schema<BookingDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
      index: true,
    },
    fieldId: {
      type: Schema.Types.ObjectId,
      ref: 'SubField',
      required: true,
      immutable: true,
      index: true,
    },
    subfieldId: {
      type: Schema.Types.ObjectId,
      ref: 'Subfield',
      required: true,
      immutable: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    from: {
      type: String,
      required: true,
      validate: HH_MM_REGEX,
    },
    to: {
      type: String,
      required: true,
      validate: HH_MM_REGEX,
    },
    price: { type: Number, required: true },
    confirmed: { type: Boolean, default: false },
    canceled: { type: Boolean, default: false },
    description: { type: String, default: null },
    paid: Boolean,
    payment: Object,
  },
  {
    timestamps: true,
  },
)

BookingSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  options: {
    projection: { password: 0, createdAt: 0, updatedAt: 0, role: 0, __v: 0 },
  },
})

BookingSchema.virtual('subfield', {
  ref: 'SubField',
  localField: 'subfieldId',
  foreignField: '_id',
  justOne: true,
  options: {
    projection: { createdAt: 0, updatedAt: 0, __v: 0, fieldId: 0 },
  },
})
BookingSchema.virtual('field', {
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

// Define a virtual field named 'status' based on 'confirmed' and 'canceled' fields
BookingSchema.virtual('status').get(function () {
  if (this.confirmed) {
    return 'confirmed'
  } else if (this.canceled) {
    return 'canceled'
  } else {
    return 'pending'
  }
})

// Apply the virtual to the schema
BookingSchema.set('toObject', { virtuals: true })
BookingSchema.set('toJSON', { virtuals: true })

const BookingModel = model<BookingDocument>('Booking', BookingSchema)

export default BookingModel
