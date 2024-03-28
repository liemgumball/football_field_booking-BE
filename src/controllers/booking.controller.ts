// Types
import { IReq, IRes } from '@src/types/express/misc'
import { TBooking } from '@src/types'

// Constants
import HttpStatusCodes from '@src/constants/HttpStatusCodes'

// Services
import * as BookingService from '@src/services/booking.service'
import * as SubFieldService from '@src/services/subfield.service'

// Utilities
import { checkExactUser } from '@src/util/authorize'

/**
 * Get booking details
 */
export async function getById(req: IReq, res: IRes) {
  const { id } = req.params

  const found = await BookingService.getDetailById(id)
  if (!found) return res.status(HttpStatusCodes.NOT_FOUND).end()

  // Check if correct user
  if (!checkExactUser(found.userId, req.user))
    return res.status(HttpStatusCodes.FORBIDDEN).end()

  return res.status(HttpStatusCodes.OK).json(found)
}

// TODO check if available to book
// TODO cancel booking after 30 minutes not confirmed
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

  return res.status(HttpStatusCodes.CREATED).json(created)
}

export async function cancel(req: IReq<Pick<TBooking, 'canceled'>>, res: IRes) {
  const canceling = req.body
  const { id } = req.params

  const found = await BookingService.getById(id)

  if (!found)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Booking not found')

  if (!checkExactUser(found.userId, req.user))
    return res.status(HttpStatusCodes.FORBIDDEN).end()

  const updated = await BookingService.cancel(id, canceling)

  if (!updated)
    return res
      .status(HttpStatusCodes.EXPECTATION_FAILED)
      .send('Failed to cancel')

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}

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

  if (!updated) return res.status(HttpStatusCodes.EXPECTATION_FAILED).end()

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}
