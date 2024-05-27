// Types
import { IReq, IRes } from '@src/types/express/misc'
import { TBooking, UserRole } from '@src/types'

// Constants
import HttpStatusCodes from '@src/constants/HttpStatusCodes'

// Services
import * as BookingService from '@src/services/booking.service'
import * as SubFieldService from '@src/services/subfield.service'
import * as FootballFieldService from '@src/services/football-field.service'

// Utilities
import { checkAdmin, checkExactUser } from '@src/util/authorize'
import { getCheckoutUrl, createCheckoutSessionObject } from '@src/util/vnpay'

/**
 * Get booking details.
 * @method GET
 * @param req.params.id Booking ID.
 * @returns `Booking Details` and `Checkout URL`.
 */
export async function getById(req: IReq, res: IRes) {
  const { id } = req.params

  const found = await BookingService.getDetailById(id)
  if (!found) return res.status(HttpStatusCodes.NOT_FOUND).end()

  // Correct User
  if (req.user?.role === UserRole.CUSTOMER) {
    if (!checkExactUser(found.userId, req.user))
      return res
        .status(HttpStatusCodes.FORBIDDEN)
        .send('Only correct users are allowed to access this')
  } else {
    // Admin
    const field = await FootballFieldService.getById(found.fieldId.toString())
    if (!field)
      return res
        .status(HttpStatusCodes.EXPECTATION_FAILED)
        .send('Invalid SubfieldId in Booking')
    //
    if (!checkAdmin(field.adminId, req.user))
      return res
        .status(HttpStatusCodes.FORBIDDEN)
        .send('Only administrator is allowed')
  }

  return res.status(HttpStatusCodes.OK).json(found)
}

/**
 * Get many Bookings based `User Session`.
 * @method GET
 */
export async function getBookings(req: IReq, res: IRes) {
  const user = req.user

  if (!user)
    return res.status(HttpStatusCodes.FORBIDDEN).send('No user specified')

  // Super user
  if (user.role === UserRole.SUPER_USER) {
    const bookings = await BookingService.getAll()

    return res.status(HttpStatusCodes.OK).json(bookings)
  }

  // User
  if (user.role === UserRole.CUSTOMER) {
    const bookings = await BookingService.getByUserId(user._id)

    return res.status(HttpStatusCodes.OK).json(bookings)
  }

  // Administrator
  const field = await FootballFieldService.getByAdminId(user._id)

  if (!field)
    return res
      .status(HttpStatusCodes.NOT_FOUND)
      .send('Field not found by admin id')

  const bookings = await BookingService.getByFieldId(field.id as string)

  return res.status(HttpStatusCodes.OK).json(bookings)
}

/**
 * Handle validation and create a new booking.
 * @method POST
 * @param req.body Data to create a new booking.
 * @description Also create a TimeOut to `cancel` the booking after `10` minutes `not being confirmed`.
 */
export async function create(req: IReq<TBooking>, res: IRes) {
  const booking = req.body

  // only correct user can create booking with their UserId
  if (!checkExactUser(booking.userId, req.user))
    return res
      .status(HttpStatusCodes.FORBIDDEN)
      .send('Only correct user can create booking for user')

  const subfield = await SubFieldService.getById(booking.subfieldId.toString())

  if (!subfield)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Subfield not found')

  const created = await BookingService.create({
    ...booking,
    fieldId: subfield.fieldId,
  })

  if (!created)
    return res
      .status(HttpStatusCodes.PRECONDITION_FAILED)
      .send('Can not create booking')

  // [ ] Consider using Cron job instead
  // Cancel after creating 10 minutes not being Confirmed
  setTimeout(
    () => {
      BookingService.cancel(created._id as unknown as string, {
        canceled: true,
      })
    },
    10 * 60 * 1000, // 10 minutes
  )

  return res.status(HttpStatusCodes.CREATED).json(created)
}

/**
 * Handle update Booking.
 * @method PATCH
 * @param req.params.id Booking ID.
 * @param res.body Data to confirmed or refuse.
 */
export async function update(req: IReq<Partial<TBooking>>, res: IRes) {
  const body = req.body
  const { id } = req.params

  const found = await BookingService.getById(id)

  if (!found)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Booking not found')

  if (found.canceled)
    return res
      .status(HttpStatusCodes.METHOD_NOT_ALLOWED)
      .send('Booking has been canceled')

  let updated: TBooking | null = null
  // Admin confirm or refuse booking
  if (body.confirmed === true) {
    // confirm booking
    updated = await BookingService.confirm(id, { confirmed: true })
  } else if (body.canceled === true) {
    // cancel booking
    updated = await BookingService.cancel(id, { canceled: true })
  } else if (body.review) {
    // review booking
    updated = await BookingService.update(id, { review: body.review })
  }

  if (!updated)
    return res
      .status(HttpStatusCodes.NOT_MODIFIED)
      .send('Failed to update booking')

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}

/**
 * Create checkout session if not already has and return checkout url.
 * @method POST
 * @param req.params.id Booking ID.
 */
export async function createCheckoutSession(req: IReq, res: IRes) {
  const { id } = req.params

  const found = await BookingService.getById(id)

  if (!found)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Booking not found')

  if (!checkExactUser(found.userId, req.user))
    return res
      .status(HttpStatusCodes.FORBIDDEN)
      .send('Only correct user is allowed')

  if (found.checkoutSession) {
    return res.status(HttpStatusCodes.CREATED).json({
      checkoutUrl: getCheckoutUrl(
        req,
        found.id as string,
        found.checkoutSession,
      ),
    })
  }

  const newCheckoutSession = createCheckoutSessionObject(found)
  const updated = await BookingService.update(id, {
    checkoutSession: newCheckoutSession,
  })

  if (!updated)
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .send('Fail to create checkout session')

  return res.status(HttpStatusCodes.CREATED).json({
    checkoutUrl: getCheckoutUrl(req, found.id as string, newCheckoutSession),
  })
}

/**
 * Get bookings by fieldId.
 * @method GET
 * @param req.params.fieldId Field ID.
 */
export async function getBookingsByFieldId(req: IReq, res: IRes) {
  const { fieldId } = req.params

  const { cursor, status } = req.query

  const bookings = await BookingService.getAll({ fieldId, status, cursor })

  return res.status(HttpStatusCodes.OK).json(bookings)
}

export async function getReviewsByField(req: IReq, res: IRes) {
  const { fieldId } = req.params

  const reviews = await BookingService.getReviewsByFieldId(fieldId)

  return res.status(HttpStatusCodes.OK).json(reviews)
}
