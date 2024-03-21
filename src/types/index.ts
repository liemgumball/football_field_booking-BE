import { Types } from 'mongoose'

export enum UserRole {
  CUSTOMER = '2001',
  ADMIN = '17601',
  SUPER_USER = '19383',
}

export type TPoint = {
  type: 'Point'
  coordinates: [number, number]
}

export type TLocation = {
  _id: Types.ObjectId
  name: string
  geo: TPoint
}

/**
 * Represents the structure of a user
 */
export type TUser = {
  _id: Types.ObjectId
  email: string
  password: string
  name?: string
  phone_number?: string
  avatar?: string
  google_access_token?: string
  role?: UserRole
}

/**
 * Represents the structure of a user
 */
export type TFootballField = {
  _id: Types.ObjectId
  admin: Types.ObjectId
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
