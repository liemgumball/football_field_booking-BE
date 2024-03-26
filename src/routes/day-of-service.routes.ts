import { Router } from 'express'

// Constants & Types
import Paths from '@src/constants/Paths'

// Controllers
import * as DayOfServiceController from '@src/controllers/day-of-service.controller'

// Middlewares
import { serialize } from '@src/middlewares/serializer.middleware'

// Schemas
import { withValidIdSchema } from '@src/schemas/common.schema'
import { searchDayOfServiceSchema } from '@src/schemas/day-of-service.schema'

const dayOfServiceRouter = Router()

// get details
dayOfServiceRouter.get(
  Paths.DAY_OF_SERVICE.DETAIL,
  serialize(withValidIdSchema),
  DayOfServiceController.getById,
)

// search
dayOfServiceRouter.get(
  '',
  serialize(searchDayOfServiceSchema),
  DayOfServiceController.search,
)

// get by fieldId
dayOfServiceRouter.get(
  Paths.DAY_OF_SERVICE.BY_SUBFIELD,
  serialize(withValidIdSchema),
  DayOfServiceController.getByFieldId,
)

// get by subfieldId
dayOfServiceRouter.get(
  Paths.DAY_OF_SERVICE.BY_SUBFIELD,
  serialize(withValidIdSchema),
  DayOfServiceController.getBySubFieldId,
)

export default dayOfServiceRouter
