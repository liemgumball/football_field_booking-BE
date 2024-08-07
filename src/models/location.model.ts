import { TLocation } from '@src/types'
import { Schema, model, Types, Document } from 'mongoose'

type LocationDocument = TLocation & Document

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
export const LocationSchema = new Schema<LocationDocument>({
  _id: {
    type: Types.ObjectId,
    ref: 'FootballField',
    required: true,
    immutable: true,
  },
  name: { type: String, required: true, index: 'text', trim: true },
  geo: {
    type: PointSchema,
    required: true,
    index: '2dsphere',
  },
})

const LocationModel = model<LocationDocument>('Location', LocationSchema)

export default LocationModel
