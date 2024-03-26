import { Router } from 'express'

// Constants
import Paths from '@src/constants/Paths'

// Controller
import * as FootballFieldController from '@src/controllers/football-field.controller'
import * as SubFieldController from '@src/controllers/subfield.controller'
import * as DayOfServiceController from '@src/controllers/day-of-service.controller'

// Middleware
import { serialize } from '@src/middlewares/serializer.middleware'
import { deserializeUser, isSuperUser } from '@src/middlewares/auth.middleware'

// Schemas
import {
  createFootballFieldSchema,
  updateFieldSchema,
} from '@src/schemas/football-field.schema'
import { withValidIdSchema } from '@src/schemas/common.schema'
import {
  createSubFieldSchema,
  updateSubFieldSchema,
} from '@src/schemas/subfield.schema'
import { updateDayOfServiceSchema } from '@src/schemas/day-of-service.schema'

const footballFieldRouter = Router()

// Get many field
footballFieldRouter.get('', FootballFieldController.getAll)

// Get by location
footballFieldRouter.get(
  Paths.FOOTBALL_FIELD.LOCATION,
  FootballFieldController.getFromLocation,
)

// Get details
footballFieldRouter.get(
  Paths.FOOTBALL_FIELD.GET,
  serialize(withValidIdSchema),
  FootballFieldController.getById,
)

// Authentication
footballFieldRouter.use(deserializeUser)

// -------------------- Only Admin can access ------------------------------ //

// Update Field (not included SubFields)
footballFieldRouter.patch(
  Paths.FOOTBALL_FIELD.UPDATE,
  serialize(updateFieldSchema),
  FootballFieldController.update,
)

// Create SubField
// TODO this should be background task
footballFieldRouter.post(
  Paths.FOOTBALL_FIELD.SUBFIELD.ALL,
  serialize(createSubFieldSchema),
  SubFieldController.createSubField,
)

// Update SubField
footballFieldRouter.patch(
  Paths.FOOTBALL_FIELD.SUBFIELD.DETAIL,
  serialize(updateSubFieldSchema),
  SubFieldController.updateSubfield,
)

// Update day of services
footballFieldRouter.patch(
  Paths.FOOTBALL_FIELD.DAY_OF_SERVICE,
  serialize(updateDayOfServiceSchema),
  DayOfServiceController.updateOne,
)

// ---------------- Only Super Users can access ------------------------- //

// Create new Football field
footballFieldRouter.post(
  Paths.FOOTBALL_FIELD.CREATE,
  serialize(createFootballFieldSchema),
  isSuperUser,
  FootballFieldController.create,
)

// Delete Football field
footballFieldRouter.delete(
  Paths.FOOTBALL_FIELD.DELETE,
  serialize(withValidIdSchema),
  isSuperUser,
  FootballFieldController.delete_,
)

export default footballFieldRouter
