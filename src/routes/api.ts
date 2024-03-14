import { Router } from 'express'

import Paths from '../constants/Paths'
import exampleRouter from './ExampleRouter'
import pingRouter from './PingRouter'

// **** api **** //
const apiRouter = Router()

// Add UserRouter
apiRouter.use(Paths.Users.Base, exampleRouter)

// Add PingRouter
apiRouter.use(Paths.Pings.Base, pingRouter)

// **** Export default **** //

export default apiRouter
