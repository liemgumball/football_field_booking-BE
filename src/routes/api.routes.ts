import { Router } from 'express'

import Paths from '../constants/Paths'

// Routers
import pingRouter from './ping.routes'
import userRouter from './user.routes'
import authRouter from './auth.routes'
import footballFieldRouter from './football-field.routes'
import dayOfServiceRouter from './day-of-service.routes'
import bookingRouter from './booking.routes'
import checkoutRouter from './checkout.routes'

// **** api **** //
const apiRouter = Router()

// Use PingRouter
apiRouter.use(Paths.PINGS.BASE, pingRouter)

// Use PingRouter
apiRouter.use(Paths.AUTH.BASE, authRouter)

// Use UserRouter
apiRouter.use(Paths.USERS.BASE, userRouter)

// Use FootballField Router
apiRouter.use(Paths.FOOTBALL_FIELD.BASE, footballFieldRouter)

// Use Day Of Service Router
apiRouter.use(Paths.DAY_OF_SERVICE.BASE, dayOfServiceRouter)

// Use Booking Router
apiRouter.use(Paths.BOOKING.BASE, bookingRouter)

// Use Checkout Router
apiRouter.use(Paths.CHECKOUT.BASE, checkoutRouter)

// **** Export default **** //
export default apiRouter
