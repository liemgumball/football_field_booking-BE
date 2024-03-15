import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { IReq, IRes } from '@src/types/express/misc'
import * as UserService from '@src/services/user.service'
import { TUser } from '@src/models/user.model'
import { isValidObjectId } from 'mongoose'

export async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll()
  return res.status(HttpStatusCodes.OK).json(users)
}

export async function getById(req: IReq, res: IRes) {
  const { id } = req.params

  if (!isValidObjectId(id))
    return res.status(HttpStatusCodes.BAD_REQUEST).send('Invalid Id')

  const user = await UserService.getById(id)
  if (user) return res.status(HttpStatusCodes.OK).json(user)

  return res.status(HttpStatusCodes.BAD_REQUEST).send('User not found')
}

export async function add(req: IReq<TUser>, res: IRes) {
  const user = req.body
  await UserService.add(user)

  return res.status(HttpStatusCodes.CREATED).end()
}

export async function delete_(req: IReq, res: IRes) {
  const { id } = req.params

  if (!isValidObjectId(id))
    return res.status(HttpStatusCodes.BAD_REQUEST).send('Invalid Id')

  const execution = await UserService.delete_(id)
  if (execution)
    return res.status(HttpStatusCodes.OK).json({ deleted: execution })

  return res.status(HttpStatusCodes.BAD_REQUEST).send('User not found')
}

export async function update(req: IReq<TUser>, res: IRes) {
  const { id } = req.params
  const user = req.body

  if (!isValidObjectId(id))
    return res.status(HttpStatusCodes.BAD_REQUEST).send('Invalid Id')

  const updated = await UserService.update(id, user)
  if (updated) return res.status(HttpStatusCodes.OK).end()

  return res.status(HttpStatusCodes.BAD_REQUEST).send('User not found')
}
