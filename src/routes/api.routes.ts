import { Router } from 'express'

// Routers
import pingRouter from './ping.routes'
import userRouter from './user.routes'
import authRouter from './auth.routes'
import footballFieldRouter from './football-field.routes'
import dayOfServiceRouter from './day-of-service.routes'
import bookingRouter from './booking.routes'
import paymentRouter from './payment.routes'
import reviewRouter from './review.routes'

// **** api **** //
const apiRouter = Router()

// Use PingRouter
apiRouter.use('/pings', pingRouter)

// Use PingRouter
apiRouter.use('/auth', authRouter)

// Use UserRouter
apiRouter.use('/users', userRouter)

// Use FootballField Router
apiRouter.use('/fields', footballFieldRouter)

// Use Day Of Service Router
apiRouter.use('/day-of-services', dayOfServiceRouter)

// Use Booking Router
apiRouter.use('/bookings', bookingRouter)

// Use Checkout Router
apiRouter.use('/checkout', paymentRouter)

// Use Review Router
apiRouter.use('/reviews', reviewRouter)

// **** Export default **** //
export default apiRouter
