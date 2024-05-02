import DatabaseService from '@src/services/database.service'
import { IReq, IRes } from '@src/types/express/misc'
import HttpStatusCodes from '@src/constants/HttpStatusCodes'

function ping(req: IReq, res: IRes) {
  const session = req.session

  return res
    .status(HttpStatusCodes.OK)
    .json({ ping: DatabaseService.ping(), session })
}

export default { ping } as const
