import { VNPayMsg } from '@src/constants/VNPayStatusMessage'
import { Types as mongooseTypes } from 'mongoose'

/**
 * Represents the structure of time formatted `HH:MM`.
 * Where `MM` is either 00 or 30
 */
export type TimeStep = string

export enum UserRole {
  CUSTOMER = '2001',
  ADMIN = '17601',
  SUPER_USER = '19383',
}

export enum TurnOfServiceStatus {
  AVAILABLE = 'available',
  IN_PROGRESS = 'progressing',
  BEING_USED = 'used',
}

export type TPoint = {
  type: 'Point'
  coordinates: [number, number]
}

export type TLocation = {
  _id: mongooseTypes.ObjectId
  name: string
  geo: TPoint
}

/**
 * Represents the structure of a user
 */
export type TUser = {
  _id: mongooseTypes.ObjectId
  email: string
  password: string
  name: string
  phoneNumber: string
  avatar: string
  google_access_token?: string
  role?: UserRole
}

export type TSubField = {
  _id: mongooseTypes.ObjectId
  fieldId: mongooseTypes.ObjectId
  field?: TFootballField
  name: string
  size: number
  availability: boolean
  defaultPrice: number
}

/**
 * Represents the structure of a user
 */
export type TFootballField = {
  _id: mongooseTypes.ObjectId
  adminId: mongooseTypes.ObjectId
  subfieldIds: mongooseTypes.ObjectId[]
  name: string
  isActive: boolean
  location: TLocation
  openedAt: TimeStep
  closedAt: TimeStep
  rating: number
  images: string[]
  subfields?: TSubField[]
}

export type TTurnOfService = {
  at: TimeStep
  price: number
  status: TurnOfServiceStatus
  bookingId: mongooseTypes.ObjectId | null
}

export type TDayOfService = {
  _id: mongooseTypes.ObjectId
  fieldId: mongooseTypes.ObjectId
  field?: TFootballField
  subfieldId: mongooseTypes.ObjectId
  subfield?: TSubField
  date: Date
  expireAt: Date
  availability: boolean
  turnOfServices: TTurnOfService[]
}

export type TBooking = {
  _id: mongooseTypes.ObjectId
  userId: mongooseTypes.ObjectId
  user?: TUser
  fieldId: mongooseTypes.ObjectId
  field?: TFootballField
  subfieldId: mongooseTypes.ObjectId
  subfield?: TSubField
  date: Date
  from: TimeStep
  to: TimeStep
  price: number
  confirmed: boolean
  canceled: boolean
  description: string | null
  name: string | null
  paid?: boolean
  checkoutSession: TCheckoutSession | null
  rating: number
}

export type TCheckoutSession = {
  amount: number
  orderId: string
  orderType: '160000' // order types specified by VNPay https://sandbox.vnpayment.vn/apis/docs/loai-hang-hoa/
  statusCode: keyof typeof VNPayMsg | null
  payDate: Date
  currCode: 'VND'
  orderBankCode?: string
}
