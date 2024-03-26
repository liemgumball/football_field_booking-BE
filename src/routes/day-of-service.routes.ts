import { Router } from 'express'

// Constants & Types
import Paths from '@src/constants/Paths'

// Controllers
import * as DayOfServiceController from '@src/controllers/day-of-service.controller'
import { withValidIdSchema } from '@src/schemas/common.schema'
import { serialize } from '@src/middlewares/serializer.middleware'

const dayOfServiceRouter = Router()

dayOfServiceRouter.get(
  Paths.DAY_OF_SERVICE.DETAIL,
  serialize(withValidIdSchema),
  DayOfServiceController.getById,
)

dayOfServiceRouter.get(
  Paths.DAY_OF_SERVICE.BY_SUBFIELD,
  serialize(withValidIdSchema),
  DayOfServiceController.getBySubFieldId,
)

export default dayOfServiceRouter
