import assert from 'assert'
import { Types } from 'mongoose'

// Types & Constants
import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { IReq, IRes } from '@src/types/express/misc'
import { TDayOfService } from '@src/types'

// Services
import * as DayOfServiceService from '@src/services/day-of-service.service'
import * as FootballFieldService from '@src/services/football-field.service'
import * as SubFieldService from '@src/services/subfield.service'

/**
 * Get `Day of service` details.
 * @method GET
 * @param req.params.id Day of service ID.
 * @param req.query.from Time step `from` turn of service.
 * @param req.query.to Time step `to` turn of service.
 */
export async function getById(req: IReq, res: IRes) {
  const { id } = req.params
  const { from, to } = req.query

  assert(typeof from === 'string' || typeof from === 'undefined')
  assert(typeof to === 'string' || typeof to === 'undefined')

  const found = await DayOfServiceService.getById(id, from, to)

  if (!found) return res.status(HttpStatusCodes.NOT_FOUND).end()

  return res.status(HttpStatusCodes.OK).json(found)
}

/**
 * Get many `Day of service` by Field ID.
 * @method GET
 * @param req.params.fieldId Field ID.
 */
export async function getByFieldId(req: IReq, res: IRes) {
  const { fieldId } = req.params
  const field = await FootballFieldService.getById(fieldId)

  if (!field)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Field not found')

  const { from, to } = req.query

  const fromQuery = typeof from === 'string' ? new Date(from) : undefined
  const toQuery = typeof to === 'string' ? new Date(to) : undefined

  const found = await DayOfServiceService.getByFieldId(
    field._id,
    fromQuery,
    toQuery,
  )

  if (!found) return res.status(HttpStatusCodes.NOT_FOUND).end()

  return res.status(HttpStatusCodes.OK).json(found)
}

/**
 * Get `Day of service` by subfield ID.
 * @method GET
 * @param req.params.subfieldId Subfield ID.
 */
export async function getBySubFieldId(req: IReq, res: IRes) {
  const { subfieldId } = req.params

  const subfield = await SubFieldService.getById(subfieldId)

  if (!subfield)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Subfield not found')

  const { date } = req.query

  const found = await DayOfServiceService.getBySubFieldId(
    subfield._id as Types.ObjectId,
    typeof date === 'string' ? new Date(date) : undefined,
  )

  if (!found) return res.status(HttpStatusCodes.NOT_FOUND).end()

  return res.status(HttpStatusCodes.OK).json(found)
}

/**
 * Update a `Day of service`.
 * @method PATCH
 * @param req.params.id Day of service ID.
 */
export async function updateOne(req: IReq<Partial<TDayOfService>>, res: IRes) {
  const { id } = req.params

  const dayOfService = await DayOfServiceService.getById(id)

  if (!dayOfService)
    return res
      .status(HttpStatusCodes.NOT_FOUND)
      .send('Day of service not found')

  const data = req.body

  const updated = await DayOfServiceService.updateOne(id, data)

  if (!updated)
    return res.status(HttpStatusCodes.NOT_MODIFIED).send('Failed to update')

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}

/**
 * Get many day of services following `location` and `time range`.
 * @method GET
 * @param req.query.latitude
 * @param req.query.longitude
 * @param req.query.distance
 * @param req.query.from
 * @param req.query.to
 * @param req.query.date Date to search for
 * @param req.query.size Size of subfield
 * @param req.query.cursor Cursor for Pagination
 * @returns Returns list of day of services.
 */
export async function search(req: IReq, res: IRes) {
  const { latitude, longitude, distance, from, to, date, size, cursor } =
    req.query

  if (!date || typeof date !== 'string')
    return res.status(HttpStatusCodes.BAD_REQUEST).send('No date provided')

  assert(typeof from === 'string')
  assert(typeof latitude === 'string' || typeof latitude === 'undefined')
  assert(typeof longitude === 'string' || typeof longitude === 'undefined')
  assert(typeof distance === 'string' || typeof distance === 'undefined')
  assert(typeof to === 'string' || typeof to === 'undefined')
  assert(typeof size === 'string' || typeof size === 'undefined')
  assert(typeof cursor === 'string' || typeof cursor === 'undefined')

  const result = await DayOfServiceService.getManyAvailable(
    new Date(date),
    from,
    latitude,
    longitude,
    distance ? +distance : undefined,
    to,
    size,
    cursor ? +cursor : undefined,
  )

  return res.status(HttpStatusCodes.OK).json(result)
}
