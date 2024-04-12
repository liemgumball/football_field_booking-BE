// Types & Constants
import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { IReq, IRes } from '@src/types/express/misc'
import { TDayOfService } from '@src/types'

// Services
import * as DayOfServiceService from '@src/services/day-of-service.service'
import * as FootballFieldService from '@src/services/football-field.service'
import * as SubFieldService from '@src/services/subfield.service'
import assert from 'assert'

/**
 * Get by Id
 */
export async function getById(req: IReq, res: IRes) {
  const { id } = req.params

  const found = await DayOfServiceService.getById(id)

  if (!found) return res.status(HttpStatusCodes.NOT_FOUND).end()

  return res.status(HttpStatusCodes.OK).json(found)
}

/**
 * Get by Field ID
 */
export async function getByFieldId(req: IReq, res: IRes) {
  const { id } = req.params
  const field = await FootballFieldService.getById(id)

  if (!field)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Field not found')

  const found = await DayOfServiceService.getByFieldId(field._id)

  if (!found) return res.status(HttpStatusCodes.NOT_FOUND).end()

  return res.status(HttpStatusCodes.OK).json(found)
}

/**
 * Get by sub field Id
 */
export async function getBySubFieldId(req: IReq, res: IRes) {
  const { id } = req.params

  const subfield = await SubFieldService.getById(id)

  if (!subfield)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Subfield not found')

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const found = await DayOfServiceService.getBySubFieldId(subfield._id)

  if (!found) return res.status(HttpStatusCodes.NOT_FOUND).end()

  return res.status(HttpStatusCodes.OK).json(found)
}

/**
 * Update a DayOfService
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
 * Get day of services following `location` and `time range`.
 * If none provided, then search from `current time` to `next week`
 * @returns Return list of day of services
 */
export async function search(req: IReq, res: IRes) {
  const { latitude, longitude, distance, from, to, date } = req.query

  if (!date || typeof date !== 'string')
    return res.status(HttpStatusCodes.BAD_REQUEST).send('No date provided')

  assert(typeof latitude === 'string' || typeof latitude === 'undefined')
  assert(typeof longitude === 'string' || typeof longitude === 'undefined')
  assert(typeof distance === 'string' || typeof distance === 'undefined')
  assert(typeof from === 'string' || typeof from === 'undefined')
  assert(typeof to === 'string' || typeof to === 'undefined')

  const result = await DayOfServiceService.getManyAvailable(
    new Date(date),
    latitude,
    longitude,
    distance ? +distance : undefined,
    from,
    to,
  )

  return res
    .status(HttpStatusCodes.OK)
    .json({ count: result.length, data: result })
}
