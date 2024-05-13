import { HH_MM_REGEX } from '@src/constants/Regex'
import { TDayOfService, TTurnOfService, TurnOfServiceStatus } from '@src/types'
import { getExpireDate } from '@src/util/date'
import { Schema, model, Document } from 'mongoose'

type DayOfServiceDocument = TDayOfService & Document
type TurnOfServiceDocument = TTurnOfService & Document

const TurnOfServiceSchema = new Schema<TurnOfServiceDocument>(
  {
    at: {
      type: String,
      required: true,
      validate: HH_MM_REGEX,
      immutable: true,
    },
    price: { type: Number },
    status: {
      type: String,
      enum: TurnOfServiceStatus,
      default: TurnOfServiceStatus.AVAILABLE,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
  },
  { _id: false }, // no auto generate Id
)

const DayOfServiceSchema = new Schema<DayOfServiceDocument>({
  expireAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 },
  },
  date: {
    type: Date,
    required: true,
    immutable: true,
  },
  fieldId: {
    type: Schema.Types.ObjectId,
    ref: 'FootballField',
    required: true,
    immutable: true,
    index: true,
  },
  subfieldId: {
    type: Schema.Types.ObjectId,
    ref: 'SubField',
    required: true,
    immutable: true,
    index: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  turnOfServices: [
    {
      type: TurnOfServiceSchema,
      required: true,
    },
  ],
})

DayOfServiceSchema.pre('validate', function (next) {
  const expireDate = getExpireDate(this.date)
  this.expireAt = expireDate
  return next()
})

// Define a virtual field to resolve the subfield from the FootballField model
DayOfServiceSchema.virtual('subfield', {
  ref: 'SubField',
  localField: 'subfieldId',
  foreignField: '_id',
  justOne: true,
})

DayOfServiceSchema.virtual('field', {
  ref: 'FootballField',
  localField: 'fieldId',
  foreignField: '_id',
  justOne: true,
})

// Apply the virtual to the schema
DayOfServiceSchema.set('toObject', { virtuals: true })
DayOfServiceSchema.set('toJSON', { virtuals: true })

const DayOfServiceModel = model<DayOfServiceDocument>(
  'DayOfService',
  DayOfServiceSchema,
)

export default DayOfServiceModel
