import { TFootballField } from '@src/types'
import { Schema, model } from 'mongoose'

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
    isActive: {
      type: Boolean,
      default: true,
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
    openedAt: {
      type: String,
      required: true,
      validate: /^\d{2}:\d{2}$/, // Validate format HH:MM
    },
    closedAt: {
      type: String,
      required: true,
      validate: /^\d{2}:\d{2}$/, // Validate format HH:MM
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
