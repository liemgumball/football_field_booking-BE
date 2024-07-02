import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { IReq, IRes } from '@src/types/express/misc'
import * as UserService from '@src/services/user.service'
import { TUser } from '@src/types'

/**
 * Handle get all users requests
 */
export async function getAll(req: IReq, res: IRes) {
  const options = {
    customer: req.query.customer === 'true' ? true : undefined,
    admin: req.query.admin === 'true' ? true : undefined,
  }

  const users = await UserService.getAll(options)

  return res.status(HttpStatusCodes.OK).json(users)
}

/**
 * Handle get user by user's Id requests
 * @param req.params.id User Id
 */
export async function getById(req: IReq, res: IRes) {
  const { id } = req.params

  const user = await UserService.getById(id)
  if (user) return res.status(HttpStatusCodes.OK).json(user)

  return res.status(HttpStatusCodes.NOT_FOUND).send('User not found')
}

/**
 * Handle delete user request
 * @param req.params.id User Id
 */
export async function delete_(req: IReq, res: IRes) {
  const { id } = req.params

  const deleted = await UserService.delete_(id)
  if (!deleted)
    return res.status(HttpStatusCodes.NOT_MODIFIED).send('Failed to delete')

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}

/**
 * Handle update user request
 * @param req.params.id User Id
 * @param req.body User data to update
 */
export async function update(req: IReq<Partial<TUser>>, res: IRes) {
  const { id } = req.params
  const user = req.body

  const updated = await UserService.update(id, user)
  if (!updated)
    return res
      .status(HttpStatusCodes.NOT_MODIFIED)
      .send('Failed to update user')

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}

/**
 * Handle add user request for change password
 * @param req.body.email
 * @param req.body.old_password
 * @param req.body.new_password
 */
export async function change_password(
  req: IReq<{ email: string; old_password: string; new_password: string }>,
  res: IRes,
) {
  const { id } = req.params

  const { email, old_password, new_password } = req.body

  const auth = await UserService.validateLogin(email, old_password)

  if (!auth) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).send('Wrong old password')
  }

  const updated = await UserService.change_password(id, new_password)

  if (!updated)
    return res
      .status(HttpStatusCodes.NOT_MODIFIED)
      .send('Failed to change password')

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}
