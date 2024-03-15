import { Router } from 'express'

import Paths from '../constants/Paths'
import pingRouter from './ping.routes'
import userRouter from './user.routes'

// **** api **** //
const apiRouter = Router()

// Add PingRouter
apiRouter.use(Paths.Pings.Base, pingRouter)

// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter)

// **** Export default **** //

export default apiRouter
