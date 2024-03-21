import { Router } from 'express'

// Constants
import Paths from '@src/constants/Paths'

// Controller
import * as FootballFieldController from '@src/controllers/football-field.controller'

// Middleware
import { serialize } from '@src/middlewares/serializer.middleware'
import { deserializeUser, isSuperUser } from '@src/middlewares/auth.middleware'

// Schemas
import { validIdSchema } from '@src/schemas/common.schema'
import {
  createFootballFieldSchema,
  updateFieldSchema,
} from '@src/schemas/football-field.schema'

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
  serialize(validIdSchema),
  FootballFieldController.getById,
)

footballFieldRouter.patch(
  Paths.FOOTBALL_FIELD.UPDATE,
  serialize(updateFieldSchema),
  FootballFieldController.update,
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
  serialize(validIdSchema),
  isSuperUser,
  FootballFieldController.delete_,
)

export default footballFieldRouter
