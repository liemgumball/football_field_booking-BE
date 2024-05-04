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
import { confirmBookingSchema } from '@src/schemas/booking.schema'

const footballFieldRouter = Router()

// Get many field
footballFieldRouter.get('', FootballFieldController.getAll)

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

// Confirm Booking
footballFieldRouter.patch(
  '/:fieldId/bookings/:id',
  isAdmin,
  serialize(confirmBookingSchema),
  BookingController.confirm,
)

// Add image
footballFieldRouter.post(
  '/:id/images',
  serialize(addImageSchema),
  FootballFieldController.addImage,
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
