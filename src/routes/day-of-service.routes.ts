import { Router } from 'express'

// Controllers
import * as DayOfServiceController from '@src/controllers/day-of-service.controller'

// Middlewares
import { serialize } from '@src/middlewares/serializer.middleware'

// Schemas
import { withValidIdSchema } from '@src/schemas/common.schema'
import {
  getDayOfServiceSchema,
  searchDayOfServiceSchema,
} from '@src/schemas/day-of-service.schema'

const dayOfServiceRouter = Router()

// get details
dayOfServiceRouter.get(
  '/:id',
  serialize(getDayOfServiceSchema),
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
  '/fields/:id',
  serialize(withValidIdSchema),
  DayOfServiceController.getByFieldId,
)

// get by subfieldId
dayOfServiceRouter.get(
  '/subfields/:id',
  serialize(withValidIdSchema),
  DayOfServiceController.getBySubFieldId,
)

export default dayOfServiceRouter
