import BookingModel from '@src/models/booking.model'
import { TBooking } from '@src/types'

import * as DayOfServiceService from './day-of-service.service'

export function getDetailById(id: string) {
  return BookingModel.findById(id).populate('user')
}

export function getById(id: string) {
  return BookingModel.findById(id)
}

export function create(data: TBooking) {
  return BookingModel.create(data)
}

export function cancel(id: string, data: Pick<TBooking, 'canceled'>) {
  return BookingModel.findByIdAndUpdate(id, data)
}

export async function confirm(
  id: string,
  confirmation: Pick<TBooking, 'confirmed'>,
) {
  const booking = await BookingModel.findById(id)

  if (!booking) return null

  const updated = await DayOfServiceService.addUserId(
    booking.subfieldId as unknown as string,
    booking.date,
    booking.userId.toString(),
    booking?.from,
    booking.to,
  )

  if (!updated) return null

  return BookingModel.findByIdAndUpdate(id, confirmation)
}
