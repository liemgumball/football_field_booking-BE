import DatabaseService from '@src/services/DatabaseService'
import { IReq, IRes } from '@src/types/express/misc'
import HttpStatusCodes from '@src/constants/HttpStatusCodes'

function ping(_: IReq, res: IRes) {
  return res.status(HttpStatusCodes.OK).json({ ping: DatabaseService.ping() })
}

export default { ping } as const
