import { Router } from 'express'

// Controllers
import * as DayOfServiceController from '@src/controllers/day-of-service.controller'

// Middlewares
import { serialize } from '@src/middlewares/serializer.middleware'

// Schemas
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
dayOfServiceRouter.get('/fields/:fieldId', DayOfServiceController.getByFieldId)

// get by subfieldId
dayOfServiceRouter.get(
  '/subfields/:subfieldId',
  DayOfServiceController.getBySubFieldId,
)

export default dayOfServiceRouter
