import { Router } from 'express'

import Paths from '../constants/Paths'
import pingRouter from './ping.routes'
import userRouter from './user.routes'

// **** api **** //
const apiRouter = Router()

// Add PingRouter
apiRouter.use(Paths.PINGS.BASE, pingRouter)

// Add UserRouter
apiRouter.use(Paths.USERS.BASE, userRouter)

// **** Export default **** //

export default apiRouter
