// Types & Constants
import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { IReq, IRes } from '@src/types/express/misc'

// Services
import * as DayOfServiceService from '@src/services/day-of-service.service'
import * as FootballFieldService from '@src/services/football-field.service'
import { checkAdmin } from '@src/util/authorize'
import { TDayOfService } from '@src/types'

export async function getById(req: IReq, res: IRes) {
  const { id } = req.params

  const found = await DayOfServiceService.getById(id)

  if (!found) return res.status(HttpStatusCodes.NO_CONTENT).end()

  return res.status(HttpStatusCodes.OK).json(found)
}

export async function getByFieldId(req: IReq, res: IRes) {
  const { fieldId } = req.params

  const field = await FootballFieldService.getById(fieldId)

  if (!field)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Field Id not found')

  if (!checkAdmin(field.adminId, req.user))
    return res.status(HttpStatusCodes.FORBIDDEN).end()

  const found = await DayOfServiceService.getByFieldId(field._id)

  if (!found) return res.status(HttpStatusCodes.NOT_FOUND).end()

  return res.status(HttpStatusCodes.OK).json(found)
}

/**
 * Update a DayOfService
 */
export async function updateOne(req: IReq<Partial<TDayOfService>>, res: IRes) {
  const { fieldId, id } = req.params

  const field = await FootballFieldService.getById(fieldId)

  if (!field)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Field Id not found')

  if (!checkAdmin(field.adminId, req.user))
    return res.status(HttpStatusCodes.FORBIDDEN).end()

  const dayOfService = await DayOfServiceService.getById(id)

  if (!dayOfService)
    return res
      .status(HttpStatusCodes.NOT_FOUND)
      .send('Day of service not found')

  const data = req.body

  const updated = await DayOfServiceService.updateOne(id, data)

  if (!updated) return res.status(HttpStatusCodes.CONFLICT).end()

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}
