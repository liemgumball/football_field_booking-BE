import { TLocation } from '@src/types'
import { Schema, model, Types } from 'mongoose'

const PointSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number, Number],
      required: true,
    },
  },
  { _id: false },
)

/**
 * Represents a point location in GeoJSON documents
 */
export const LocationSchema = new Schema({
  _id: { type: Types.ObjectId, ref: 'FootballField', required: true },
  name: { type: String, required: true, index: 'text' },
  geo: {
    type: PointSchema,
    required: true,
    index: '2dsphere',
  },
})

export const LocationModel = model<TLocation>('Location', LocationSchema)
