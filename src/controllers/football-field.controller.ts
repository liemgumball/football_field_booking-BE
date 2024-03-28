// Constants & Types
import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { IReq, IRes } from '@src/types/express/misc'
import { TFootballField, TUser } from '@src/types'

// Services
import * as FootballFieldService from '@src/services/football-field.service'
import * as UserService from '@src/services/user.service'
import * as LocationService from '@src/services/location.service'

export async function getAll(req: IReq, res: IRes) {
  const { name } = req.query

  const options = { name: typeof name === 'string' ? name : undefined }

  const fields = await FootballFieldService.getAll(options)

  return res.status(HttpStatusCodes.OK).json(fields)
}

export async function getFromLocation(req: IReq, res: IRes) {
  const { longitude, latitude, distance } = req.query

  if (typeof longitude !== 'string' || typeof latitude !== 'string')
    return res.status(HttpStatusCodes.BAD_REQUEST).end()

  const fields = await LocationService.getFieldNearFromLocation(
    [+longitude, +latitude],
    typeof distance === 'string' ? +distance : undefined,
  )

  if (!fields) return res.status(HttpStatusCodes.NOT_FOUND).end()

  return res.status(HttpStatusCodes.OK).json(fields)
}

/**
 * Get all football field details requests by admin role
 */
export async function getById(req: IReq, res: IRes) {
  const { id } = req.params

  const field = await FootballFieldService.getById(id)

  if (!field)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Data not found')

  return res.status(HttpStatusCodes.OK).json(field)
}

/**
 * Create new football field by super user // [ ] should be transaction
 */
export async function create(
  req: IReq<{ football_field: TFootballField; admin: TUser }>,
  res: IRes,
) {
  const { football_field, admin } = req.body

  const newAdmin = await UserService.createAdminUser(admin)

  if (!newAdmin)
    return res
      .status(HttpStatusCodes.EXPECTATION_FAILED)
      .send('Failure creating Admin')

  const created = await FootballFieldService.create({
    ...football_field,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    adminId: newAdmin._id,
  })

  if (!created)
    return res
      .status(HttpStatusCodes.EXPECTATION_FAILED)
      .send('Failure creating new Football Field')

  return res.status(HttpStatusCodes.CREATED).json(created)
}

/**
 * Update football field by admin
 */
export async function update(req: IReq<TFootballField>, res: IRes) {
  const { id } = req.params
  const data = req.body

  const updated = await FootballFieldService.update(id, data)

  if (!updated)
    return res.status(HttpStatusCodes.NOT_MODIFIED).send('Update failed')

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}

/**
 * Delete football field by super user
 */
export async function delete_(req: IReq, res: IRes) {
  const { id } = req.params

  const deleted = await FootballFieldService.delete_(id)

  if (!deleted)
    return res.status(HttpStatusCodes.NOT_MODIFIED).send('Failed to delete')

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}
