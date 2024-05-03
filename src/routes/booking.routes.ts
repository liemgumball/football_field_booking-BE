import { Router } from 'express'

// Controllers
import * as BookingController from '@src/controllers/booking.controller'
import { deserializeUser } from '@src/middlewares/auth.middleware'
import { serialize } from '@src/middlewares/serializer.middleware'
import {
  cancelBookingSchema,
  createBookingSchema,
  reviewBookingSchema,
} from '@src/schemas/booking.schema'

const bookingRouter = Router()

// Authentication
bookingRouter.use(deserializeUser)

// -------------------- Only exact User can access -----------------------------
// Get Booking details
bookingRouter.get('/:id', BookingController.getById)

// Get Booking by UserId
bookingRouter.get('', BookingController.getBookings)

// Create Booking
bookingRouter.post('', serialize(createBookingSchema), BookingController.create)

// Cancel Booking
bookingRouter.patch(
  '/:id',
  serialize(cancelBookingSchema),
  BookingController.cancel,
)

// Create checkout session
bookingRouter.post(
  '/:id/create-checkout',
  BookingController.createCheckoutSession,
)

bookingRouter.patch(
  '/:id/review',
  serialize(reviewBookingSchema),
  BookingController.review,
)

// ------------------------ Only Admin can access ------------------------------

export default bookingRouter
