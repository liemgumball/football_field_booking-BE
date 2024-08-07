import { Router } from 'express'

// Controller
import * as FootballFieldController from '@src/controllers/football-field.controller'
import * as SubFieldController from '@src/controllers/subfield.controller'
import * as DayOfServiceController from '@src/controllers/day-of-service.controller'
import * as BookingController from '@src/controllers/booking.controller'

// Middleware
import { serialize } from '@src/middlewares/serializer.middleware'
import {
  deserializeUser,
  isAdmin,
  isSuperUser,
} from '@src/middlewares/auth.middleware'

// Schemas
import {
  addImageSchema,
  createFootballFieldSchema,
  updateFieldSchema,
} from '@src/schemas/football-field.schema'
import { withValidIdSchema } from '@src/schemas/common.schema'
import {
  createSubFieldSchema,
  updateSubFieldSchema,
} from '@src/schemas/subfield.schema'
import { updateDayOfServiceSchema } from '@src/schemas/day-of-service.schema'
import { updateBookingSchema } from '@src/schemas/booking.schema'
import { AnyZodObject } from 'zod'

const footballFieldRouter = Router()

// Get many field
footballFieldRouter.get('', FootballFieldController.getAll)

// Get best fields
footballFieldRouter.get('/bests', FootballFieldController.getBests)

// Get by location
footballFieldRouter.get('/locations', FootballFieldController.getFromLocation)

// Get details
footballFieldRouter.get(
  '/:id',
  serialize(withValidIdSchema),
  FootballFieldController.getById,
)

// Authentication
footballFieldRouter.use(deserializeUser)

// -------------------- Only Admin can access ------------------------------ //

footballFieldRouter.get('/admin/:adminId', FootballFieldController.getByAdminId)

// Update Field (not included SubFields)
footballFieldRouter.patch(
  '/:id',
  isAdmin,
  serialize(updateFieldSchema),
  FootballFieldController.update,
)

// Create SubField
footballFieldRouter.post(
  '/:fieldId/subfields',
  isAdmin,
  serialize(createSubFieldSchema),
  SubFieldController.createSubField,
)

// Update SubField
footballFieldRouter.patch(
  '/:fieldId/subfields/:id',
  isAdmin,
  serialize(updateSubFieldSchema),
  SubFieldController.updateSubfield,
)

// Update day of services
footballFieldRouter.patch(
  '/:fieldId/day-of-services/:id',
  isAdmin,
  serialize(updateDayOfServiceSchema),
  DayOfServiceController.updateOne,
)

footballFieldRouter.get(
  '/:fieldId/bookings',
  isAdmin,
  BookingController.getBookingsByFieldId,
)

// Update Booking
footballFieldRouter.patch(
  '/:fieldId/bookings/:id',
  isAdmin,
  serialize(updateBookingSchema satisfies AnyZodObject),
  BookingController.update,
)

// Add image
footballFieldRouter.post(
  '/:fieldId/images',
  isAdmin,
  serialize(addImageSchema),
  FootballFieldController.addImage,
)

// Get reviews
footballFieldRouter.get(
  '/:fieldId/reviews',
  isAdmin,
  BookingController.getReviewsByField,
)

// ---------------- Only Super Users can access ------------------------- //

// Create new Football field
footballFieldRouter.post(
  '',
  isSuperUser,
  serialize(createFootballFieldSchema),
  FootballFieldController.create,
)

// Delete Football field
footballFieldRouter.delete(
  '/:id',
  isSuperUser,
  serialize(withValidIdSchema),
  FootballFieldController.delete_,
)

export default footballFieldRouter
