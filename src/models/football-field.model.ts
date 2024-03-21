import { TFootballField } from '@src/types'
import { Schema, model } from 'mongoose'

/**
 * Define the Mongoose schema for time in a day with a step of 30 minutes
 */
const TimeSchema = new Schema(
  {
    hour: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: 'Hour must be an integer',
      },
      min: 0,
      max: 23,
    },
    minute: {
      type: Number,
      required: true,
      enum: { values: [0, 30], message: 'Minute must be 0 or 30' },
    },
  },
  {
    _id: false, // not generated _id in database
  },
)

/**
 * Represents subfields of football fields
 */
const SubFieldSchema = new Schema({
  name: { type: String, required: true },
  size: {
    type: Number,
    required: true,
    enum: {
      values: [5, 6, 7, 11],
      message: 'Subfield size must be 5 or 6 or 7 or 11',
    },
  },
  availability: {
    type: Boolean,
    required: true,
  },
  defaultPrice: {
    type: Number,
    required: true,
  },
})

type FootballFieldDocument = TFootballField & {
  created_at: Date
  updated_at: Date
}

/**
 * Represents the structure of a football field
 */
const FootballFieldSchema = new Schema<FootballFieldDocument>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      index: 'text',
      trim: true,
    },
    subfields: {
      type: [SubFieldSchema],
      default: [],
    },
    opened_at: {
      type: TimeSchema,
      required: true,
    },
    closed_at: {
      type: TimeSchema,
      required: true,
    },
    rating: { type: Number, default: null },
    images: { type: [String], default: [] },
  },
  {
    timestamps: true,
  },
)

export const FootballFieldModel = model<FootballFieldDocument>(
  'FootballField',
  FootballFieldSchema,
)
