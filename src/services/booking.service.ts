import { startSession } from 'mongoose'

import BookingModel from '@src/models/booking.model'
import FootballFieldModel from '@src/models/football-field.model'
import { TBooking, TCheckoutSession, TurnOfServiceStatus } from '@src/types'

import * as DayOfServiceService from './day-of-service.service'

export function getAll(options: Record<string, unknown> = {}) {
  const query: Record<string, unknown> = {}

  if (options.fieldId) query.fieldId = options.fieldId

  // [ ] data status structure not good
  // Handle 'status' option
  if (options.status) {
    if (options.status === 'confirmed') query.confirmed = true
    if (options.status === 'canceled') query.canceled = true
    if (options.status === 'pending') {
      query.confirmed = false
      query.canceled = false
    }
  }
  // Handle 'cursor' and 'limit' options
  let cursor: number | undefined = undefined
  if (options.cursor) {
    const temp = Number(options.cursor)
    if (!isNaN(temp)) {
      cursor = temp
    }
  }

  return BookingModel.find(query)
    .skip(cursor ? cursor * 10 : 0)
    .limit(cursor ? 10 : Infinity)
    .populate('subfield')
    .populate('field')
    .select('-__v')
    .sort('-createdAt')
}

export function getByUserId(id: string) {
  return BookingModel.find({ userId: id })
    .populate('subfield')
    .populate('field')
    .select('-__v')
    .sort('-createdAt')
}

export function getByFieldId(id: string) {
  return BookingModel.find({ fieldId: id })
    .populate('subfield')
    .select('-__v')
    .sort('-createdAt')
}

export function getDetailById(id: string) {
  return BookingModel.findById(id)
    .populate('user')
    .populate('subfield')
    .populate('field')
    .select('-__v -checkoutSession')
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

  // update day-of-service status
  const dayOfService = await DayOfServiceService.addBookingId(
    id,
    booking.subfieldId as unknown as string,
    booking.date,
    booking?.from,
    booking.to,
    TurnOfServiceStatus.BEING_USED,
  )

  // if nothing is updated
  if (!dayOfService.modifiedCount) return null

  return BookingModel.findByIdAndUpdate(id, confirmation)
}

export async function payBooking(
  id: string,
  checkoutSession: TCheckoutSession,
) {
  const booking = await BookingModel.findById(id)

  // if booking not found
  if (!booking) return null

  // if already paid
  if (booking.paid) return null

  // update day-of-service status
  const dayOfService = await DayOfServiceService.addBookingId(
    id,
    booking.subfieldId as unknown as string,
    booking.date,
    booking?.from,
    booking.to,
    TurnOfServiceStatus.BEING_USED,
  )

  if (!dayOfService.modifiedCount) return null

  return BookingModel.findByIdAndUpdate(id, {
    paid: true,
    checkoutSession: checkoutSession,
    confirmed: true,
  })
}

/**
 *
 * @param id Booking Id
 * @param data to update
 */
export async function update(id: string, data: Partial<TBooking>) {
  // update without review
  if (!data.review) return BookingModel.findByIdAndUpdate(id, data)

  // with review
  // [ ] better to refactor the with the review model
  const session = await startSession()
  try {
    session.startTransaction()

    const updated = await BookingModel.findByIdAndUpdate(id, data, {
      new: true,
      session,
    })

    if (updated) {
      const result = await BookingModel.aggregate([
        { $match: { fieldId: updated.fieldId } },
        {
          $project: {
            fieldId: 1,
            rating: '$review.rating', // Convert null ratings to 0
          },
        },
        {
          $group: {
            _id: '$fieldId',
            averageRating: { $avg: '$rating' }, // Calculate average rating
          },
        },
      ]).session(session)

      if (result.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const averageRating = result.at(0).averageRating as number

        await FootballFieldModel.findByIdAndUpdate(
          updated.fieldId,
          { rating: averageRating },
          { session },
        )
      }

      await session.commitTransaction()
      session.endSession()
    } else {
      throw updated
    }
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    throw error
  }
}

export function getReviewsByFieldId(fieldId: string) {
  return BookingModel.find({
    fieldId: fieldId,
    review: {
      $ne: null,
    },
  }).select('review')
}
