import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import * as FootballFieldService from '@src/services/football-field.service'
import { TFootballField } from '@src/types'
import { IReq, IRes } from '@src/types/express/misc'

/**
 * Handle get all football fields requests
 */
export async function getAll(_: IReq, res: IRes) {
  const fields = await FootballFieldService.getAll()

  return res.status(HttpStatusCodes.OK).json(fields)
}

export async function getById(req: IReq, res: IRes) {
  const { id } = req.params

  const field = await FootballFieldService.getById(id)

  if (!field)
    return res.status(HttpStatusCodes.NO_CONTENT).send('Data not found')

  return res.status(HttpStatusCodes.OK).json(field)
}

export async function create(req: IReq<TFootballField>, res: IRes) {
  const data = req.body

  await FootballFieldService.create(data)

  return res.status(HttpStatusCodes.CREATED).end()
}

export async function update(req: IReq<TFootballField>, res: IRes) {
  const { id } = req.params
  const data = req.body

  const updated = await FootballFieldService.update(id, data)

  if (!updated)
    return res.status(HttpStatusCodes.NO_CONTENT).send('Update failed')

  return res.status(HttpStatusCodes.OK).json(updated)
}

export async function delete_(req: IReq, res: IRes) {
  const { id } = req.params

  const deleted = await FootballFieldService.delete_(id)

  if (!deleted)
    return res.status(HttpStatusCodes.NO_CONTENT).send('Delete failed')

  return res.status(HttpStatusCodes.OK).end()
}
