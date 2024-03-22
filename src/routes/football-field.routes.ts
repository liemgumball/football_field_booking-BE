import { Router } from 'express'

// Constants
import Paths from '@src/constants/Paths'

// Controller
import * as FootballFieldController from '@src/controllers/football-field.controller'
import * as ReservationController from '@src/controllers/reservation.controller'

// Middleware
import { serialize } from '@src/middlewares/serializer.middleware'
import { deserializeUser, isSuperUser } from '@src/middlewares/auth.middleware'

// Schemas
import {
  createFootballFieldSchema,
  updateFieldSchema,
} from '@src/schemas/football-field.schema'
import { withValidIdSchema } from '@src/schemas/common.schema'
import { createManyReservationSchema } from '@src/schemas/reservation.schema'

const footballFieldRouter = Router()

footballFieldRouter.get('', FootballFieldController.getAll)

footballFieldRouter.get(
  Paths.FOOTBALL_FIELD.LOCATION,
  FootballFieldController.getFromLocation,
)

// Authentication
footballFieldRouter.use(deserializeUser)

// Admin can access
footballFieldRouter.get(
  Paths.FOOTBALL_FIELD.GET,
  serialize(withValidIdSchema),
  FootballFieldController.getById,
)

footballFieldRouter.patch(
  Paths.FOOTBALL_FIELD.UPDATE,
  serialize(updateFieldSchema),
  FootballFieldController.update,
)

footballFieldRouter.post(
  Paths.FOOTBALL_FIELD.RESERVATION,
  serialize(createManyReservationSchema),
  ReservationController.createManyReservation,
)

// Only Super Users can access
footballFieldRouter.post(
  Paths.FOOTBALL_FIELD.CREATE,
  serialize(createFootballFieldSchema),
  isSuperUser,
  FootballFieldController.create,
)

footballFieldRouter.delete(
  Paths.FOOTBALL_FIELD.DELETE,
  serialize(withValidIdSchema),
  isSuperUser,
  FootballFieldController.delete_,
)

export default footballFieldRouter
