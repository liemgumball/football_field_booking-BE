import BookingModel from '@src/models/booking.model'
import { TBooking } from '@src/types'

export function getById(id: string) {
  return BookingModel.findById(id)
}

export function create(data: TBooking) {
  return BookingModel.create(data)
}

export function update(id: string, data: Partial<TBooking>) {
  return BookingModel.findByIdAndUpdate(id, data)
}
