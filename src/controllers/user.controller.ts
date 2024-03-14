import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { IReq, IRes } from '@src/types/express/misc'
import UserService from '@src/services/user.service'
import { TUser } from '@src/models/user.model'

async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll()
  return res.status(HttpStatusCodes.OK).json({ users })
}

async function add(req: IReq<{ user: TUser }>, res: IRes) {
  const { user } = req.body
  await UserService.addOne(user)
  return res.status(HttpStatusCodes.CREATED).end()
}

async function _delete(req: IReq, res: IRes) {
  const { id } = req.params
  await UserService.delete(id)
  res.status(HttpStatusCodes.OK).end()
}

export default { getAll, add, delete: _delete } as const
