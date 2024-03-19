import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { IReq, IRes } from '@src/types/express/misc'
import * as UserService from '@src/services/user.service'
import { TUser } from '@src/types'

/**
 * Handle get all users requests
 */
export async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll()
  return res.status(HttpStatusCodes.OK).json(users)
}

/**
 * Handle get user by user's Id requests
 */
export async function getById(req: IReq, res: IRes) {
  const { id } = req.params

  const user = await UserService.getById(id)
  if (user) return res.status(HttpStatusCodes.OK).json(user)

  return res.status(HttpStatusCodes.NO_CONTENT).send('User not found')
}

/**
 * Handle delete user request
 */
export async function delete_(req: IReq, res: IRes) {
  const { id } = req.params

  const deleted = await UserService.delete_(id)
  if (!deleted)
    return res.status(HttpStatusCodes.NO_CONTENT).send('User not found')

  return res.status(HttpStatusCodes.OK).end()
}

/**
 * Handle update user request
 */
export async function update(req: IReq<TUser>, res: IRes) {
  const { id } = req.params
  const user = req.body

  const updated = await UserService.update(id, user)
  if (!updated)
    return res.status(HttpStatusCodes.NO_CONTENT).send('User not found')

  return res.status(HttpStatusCodes.OK).json(updated)
}
