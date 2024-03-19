import { ObjectId } from 'mongoose'

export type TLocation = {
  _id: ObjectId
  name: string
  type: 'Point'
  coordinates: [number, number]
}
/**
 * Represents the structure of a user
 */
export type TUser = {
  _id: ObjectId
  email: string
  password: string
  name?: string
  phone_number?: string
  avatar?: string
  google_access_token?: string
  isAdmin?: boolean
}

/**
 * Represents the structure of a user
 */
export type TFootballField = {
  _id: ObjectId
  name: string
  location: TLocation
  subfields: {
    name: string
    size: number
    availability: boolean
    defaultPrice: number
  }[]
  opened_at: { hour: number; minute: number }
  closed_at: { hour: number; minute: number }
  rating: number
  images: string[]
}
