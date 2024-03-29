import BookingModel from '@src/models/booking.model'
import { TBooking, TurnOfServiceStatus } from '@src/types'

import * as DayOfServiceService from './day-of-service.service'

export function getDetailById(id: string) {
  return BookingModel.findById(id).populate('user')
}

export function getById(id: string) {
  return BookingModel.findById(id)
}

export async function create(data: TBooking) {
  // If status is `available` then valid to `book`
  const check = await DayOfServiceService.checkValidUpdate(
    data.date,
    data.subfieldId as unknown as string,
    data.from,
    data.to,
    TurnOfServiceStatus.AVAILABLE,
  )

  if (!check) return null

  const booking = await BookingModel.create(data)

  const dayOfService = await DayOfServiceService.addBookingId(
    booking.id as unknown as string,
    booking.subfieldId as unknown as string,
    booking.date,
    booking?.from,
    booking.to,
    TurnOfServiceStatus.IN_PROGRESS,
  )

  return booking && dayOfService.modifiedCount ? booking : null
}

export async function cancel(id: string, data: Pick<TBooking, 'canceled'>) {
  const booking = await BookingModel.findById(id)

  if (!booking) return null

  // If status is `in progress` then valid to `cancel`
  const check = await DayOfServiceService.checkValidUpdate(
    booking.date,
    booking.subfieldId as unknown as string,
    booking.from,
    booking.to,
    TurnOfServiceStatus.IN_PROGRESS,
  )

  if (!check) return null

  const dayOfService = await DayOfServiceService.addBookingId(
    null,
    booking.subfieldId as unknown as string,
    booking.date,
    booking?.from,
    booking.to,
    TurnOfServiceStatus.AVAILABLE,
  )

  return dayOfService ? BookingModel.findByIdAndUpdate(id, data) : null
}

export async function confirm(
  id: string,
  confirmation: Pick<TBooking, 'confirmed'>,
) {
  const booking = await BookingModel.findById(id)

  if (!booking) return null

  // If status is `in progress` then valid to `confirm`
  const check = await DayOfServiceService.checkValidUpdate(
    booking.date,
    booking.subfieldId as unknown as string,
    booking.from,
    booking.to,
    TurnOfServiceStatus.IN_PROGRESS,
  )

  if (!check) return null

  const dayOfService = await DayOfServiceService.addBookingId(
    id,
    booking.subfieldId as unknown as string,
    booking.date,
    booking?.from,
    booking.to,
    TurnOfServiceStatus.BEING_USED,
  )

  if (!dayOfService.modifiedCount) return null

  return BookingModel.findByIdAndUpdate(id, confirmation)
}
