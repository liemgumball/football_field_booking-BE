import { HH_MM_REGEX } from '@src/constants/Regex'
import { TDayOfService, TTurnOfService } from '@src/types'
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
    availability: { type: Boolean, default: false },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
  },
  { _id: false }, // no auto generate Id
)

const DayOfServiceSchema = new Schema<DayOfServiceDocument>({
  date: {
    type: Date,
    required: true,
    immutable: true,
    validate: {
      validator: (date: Date) => {
        const today = new Date()

        const twoMonthsLater = new Date()
        twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2) // Set to 2 months later

        // Validate if the date is at least today and at most two months later
        return date >= today && date <= twoMonthsLater
      },
      message: 'Date must in range from today to maximum of two Months Later',
    },
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
    ref: 'Subfield',
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

// Define a virtual field to resolve the subfield from the FootballField model
DayOfServiceSchema.virtual('subfield', {
  ref: 'SubField',
  localField: 'subfieldId',
  foreignField: '_id',
  justOne: true,
})

// Apply the virtual to the schema
DayOfServiceSchema.set('toObject', { virtuals: true })
DayOfServiceSchema.set('toJSON', { virtuals: true })

export const DayOfServiceModel = model<DayOfServiceDocument>(
  'DayOfService',
  DayOfServiceSchema,
)
