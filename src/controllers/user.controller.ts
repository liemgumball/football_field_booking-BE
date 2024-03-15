import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { IReq, IRes } from '@src/types/express/misc'
import UserService from '@src/services/user.service'
import { TUser } from '@src/models/user.model'

async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll()
  return res.status(HttpStatusCodes.OK).json(users)
}

async function getById(req: IReq, res: IRes) {
  const { id } = req.params
  const user = await UserService.getById(id)

  if (user) return res.status(HttpStatusCodes.OK).json(user)
  return res.status(HttpStatusCodes.NOT_FOUND).send('User not found')
}

async function add(req: IReq<TUser>, res: IRes) {
  const user = req.body
  await UserService.addOne(user)
  return res.status(HttpStatusCodes.CREATED).end()
}

async function _delete(req: IReq, res: IRes) {
  const { id } = req.params
  const execution = await UserService.delete(id)

  if (execution)
    return res.status(HttpStatusCodes.OK).json({ deleted: execution })
  return res.status(HttpStatusCodes.NOT_FOUND).send('User not found')
}

async function update(req: IReq<TUser>, res: IRes) {
  const { id } = req.params
  const user = req.body

  const updated = await UserService.update(id, user)
  if (updated) return res.status(HttpStatusCodes.OK).end()
  return res.status(HttpStatusCodes.NOT_FOUND).send('User not found')
}

export default { getAll, getById, add, delete: _delete, update } as const
