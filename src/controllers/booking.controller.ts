// Types
import { IReq, IRes } from '@src/types/express/misc'
import { TBooking } from '@src/types'

// Constants
import HttpStatusCodes from '@src/constants/HttpStatusCodes'

// Services
import * as BookingService from '@src/services/booking.service'
import * as SubFieldService from '@src/services/subfield.service'
import * as FootballFieldService from '@src/services/football-field.service'

// Utilities
import { checkAdmin, checkExactUser } from '@src/util/authorize'

/**
 * Get booking details
 */
export async function getById(req: IReq, res: IRes) {
  const { id } = req.params

  const found = await BookingService.getDetailById(id)
  if (!found) return res.status(HttpStatusCodes.NOT_FOUND).end()

  const field = await FootballFieldService.getBySubfieldId(
    found.subfieldId.toString(),
  )
  if (!field) return res.status(HttpStatusCodes.EXPECTATION_FAILED).end()

  // Check if correct user
  if (
    !checkExactUser(found.userId, req.user) &&
    !checkAdmin(field?.adminId, req.user)
  )
    return res.status(HttpStatusCodes.FORBIDDEN).end()

  return res.status(HttpStatusCodes.OK).json(found)
}

/**
 * Handle validation and create a new booking.
 * Also create a TimeOut to `cancel` the booking after `10` minutes `not being confirmed`.
 */
export async function create(req: IReq<TBooking>, res: IRes) {
  const booking = req.body

  // only correct user can create booking with their UserId
  if (!checkExactUser(booking.userId, req.user))
    return res.status(HttpStatusCodes.FORBIDDEN).end()

  const subfield = await SubFieldService.getById(booking.subfieldId.toString())

  if (!subfield)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Subfield not found')

  const created = await BookingService.create(booking)

  if (!created)
    return res
      .status(HttpStatusCodes.PRECONDITION_FAILED)
      .send('Can not create booking')

  // Cancel after creating 10 minutes not being Confirmed
  setTimeout(
    () => {
      BookingService.cancel(created._id as unknown as string, {
        canceled: true,
      })
    },
    10 * 60 * 1000,
  )

  return res.status(HttpStatusCodes.CREATED).json(created)
}

/**
 * Handle booking request by User
 */
export async function cancel(req: IReq<Pick<TBooking, 'canceled'>>, res: IRes) {
  const canceling = req.body
  const { id } = req.params

  const found = await BookingService.getById(id)

  if (!found)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Booking not found')

  if (!checkExactUser(found.userId, req.user))
    return res.status(HttpStatusCodes.FORBIDDEN).end()

  if (found.canceled)
    return res
      .status(HttpStatusCodes.METHOD_NOT_ALLOWED)
      .send('Already canceled')

  const updated = await BookingService.cancel(id, canceling)

  if (!updated)
    return res.status(HttpStatusCodes.CONFLICT).send('Failed to cancel booking')

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}

/**
 * Handle confirm booking by Admin
 */
export async function confirm(
  req: IReq<Pick<TBooking, 'confirmed'>>,
  res: IRes,
) {
  const confirming = req.body
  const { id } = req.params

  const found = await BookingService.getById(id)

  if (!found)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Booking not found')

  if (found.canceled)
    return res
      .status(HttpStatusCodes.METHOD_NOT_ALLOWED)
      .send('Booking has been canceled')

  // Admin confirm booking
  const updated = await BookingService.confirm(id, confirming)

  if (!updated)
    return res
      .status(HttpStatusCodes.CONFLICT)
      .send('Failed to confirm booking')

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}
