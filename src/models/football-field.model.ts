import { HH_MM_REGEX } from '@src/constants/Regex'
import { TFootballField } from '@src/types'
import { Schema, model } from 'mongoose'

type FootballFieldDocument = TFootballField &
  Document & {
    created_at: Date
    updated_at: Date
  }

/**
 * Represents the structure of a football field
 */
const FootballFieldSchema = new Schema<FootballFieldDocument>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subfieldIds: [
      { type: Schema.Types.ObjectId, ref: 'SubField', default: [] },
    ],
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
    openedAt: {
      type: String,
      required: true,
      validate: HH_MM_REGEX,
    },
    closedAt: {
      type: String,
      required: true,
      validate: HH_MM_REGEX,
    },

    rating: { type: Number, default: null },
    images: { type: [String], default: [] },
  },
  {
    timestamps: true,
  },
)

FootballFieldSchema.virtual('subfields', {
  ref: 'SubField',
  localField: 'subfieldIds',
  foreignField: '_id',
})

FootballFieldSchema.virtual('location', {
  ref: 'Location',
  localField: '_id',
  foreignField: '_id',
  justOne: true,
})

// Apply the virtual to the schema
FootballFieldSchema.set('toObject', { virtuals: true })
FootballFieldSchema.set('toJSON', { virtuals: true })

export const FootballFieldModel = model<FootballFieldDocument>(
  'FootballField',
  FootballFieldSchema,
)
