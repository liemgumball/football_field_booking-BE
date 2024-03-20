import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import * as FootballFieldService from '@src/services/football-field.service'
import { TFootballField, TUser } from '@src/types'
import { IReq, IRes } from '@src/types/express/misc'
import * as UserService from '@src/services/user.service'
import { checkAdmin, checkSuperUser } from '@src/util/authorize'

/**
 * Handle get all football fields requests
 */
export async function getAll(_: IReq, res: IRes) {
  const fields = await FootballFieldService.getAll()

  return res.status(HttpStatusCodes.OK).json(fields)
}

/**
 * Get all football field details requests by admin role
 */
export async function getById(req: IReq, res: IRes) {
  const { id } = req.params

  const field = await FootballFieldService.getById(id)

  if (!field)
    return res.status(HttpStatusCodes.BAD_REQUEST).send('Data not found')

  // check if is admin
  if (!checkAdmin(field.admin, req.user))
    return res.status(HttpStatusCodes.FORBIDDEN).send('Not authorized')

  return res.status(HttpStatusCodes.OK).json(field)
}

/**
 * Create new football field by super user
 */
export async function create(
  req: IReq<{ football_field: TFootballField; admin: TUser }>,
  res: IRes,
) {
  if (!checkSuperUser(req.user))
    return res
      .status(HttpStatusCodes.FORBIDDEN)
      .send('Only superuser can create new football field')

  const { football_field, admin } = req.body

  const newAdmin = await UserService.createAdminUser(admin)

  await FootballFieldService.create({ ...football_field, admin: newAdmin._id })

  return res.status(HttpStatusCodes.CREATED).end()
}

/**
 * Update football field by admin
 */
export async function update(req: IReq<TFootballField>, res: IRes) {
  const { id } = req.params
  const data = req.body

  const field = await FootballFieldService.getById(id)

  if (!field)
    return res.status(HttpStatusCodes.BAD_REQUEST).send('Data not found')

  if (!checkAdmin(field.admin, req.user))
    return res.status(HttpStatusCodes.FORBIDDEN).send('Not authorized')

  const updated = await FootballFieldService.update(id, data)

  if (!updated)
    return res.status(HttpStatusCodes.BAD_REQUEST).send('Update failed')

  return res.status(HttpStatusCodes.OK).end()
}

/**
 * Delete football field by super user
 */
export async function delete_(req: IReq, res: IRes) {
  if (!checkSuperUser(req.user))
    return res
      .status(HttpStatusCodes.FORBIDDEN)
      .send('Only super users can delete football field')

  const { id } = req.params

  const deleted = await FootballFieldService.delete_(id)

  if (!deleted)
    return res.status(HttpStatusCodes.BAD_REQUEST).send('Delete failed')

  return res.status(HttpStatusCodes.OK).end()
}
