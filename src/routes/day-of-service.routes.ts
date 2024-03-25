import { Router } from 'express'

// Constants & Types
import Paths from '@src/constants/Paths'

// Controllers
import * as DayOfServiceController from '@src/controllers/day-of-service.controller'

const dayOfServiceRouter = Router()

// dayOfServiceRouter.get('', TestController.test)

// dayOfServiceRouter.get(Paths.DAY_OF_SERVICE.GET, DayOfServiceController.getById)

export default dayOfServiceRouter
