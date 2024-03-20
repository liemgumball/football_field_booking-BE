import { TLocation } from '@src/types'
import { Schema, model, Types } from 'mongoose'

/**
 * Represents a point location in GeoJSON documents
 */
export const LocationSchema = new Schema({
  _id: { type: Types.ObjectId, ref: 'FootballField', required: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number, Number],
    required: true,
    unique: true,
  },
})

export const LocationModel = model<TLocation>('Location', LocationSchema)
