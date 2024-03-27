import { TSubField } from '@src/types'
import { Schema, model, Document } from 'mongoose'

type SubFieldDocument = TSubField &
  Document & {
    createdAt: Date
    updatedAt: Date
  }

/**
 * Represents subfields of football fields
 */
const SubFieldSchema = new Schema<SubFieldDocument>(
  {
    name: { type: String, required: true },
    fieldId: {
      type: Schema.Types.ObjectId,
      ref: 'FootballField',
      immutable: true,
    },
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
      default: true,
    },
    defaultPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const SubFieldModel = model<SubFieldDocument>('SubField', SubFieldSchema)

export default SubFieldModel
