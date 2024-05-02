import { Router } from 'express'

import * as ReviewController from '@src/controllers/review.controller'
import { deserializeUser } from '@src/middlewares/auth.middleware'
import { serialize } from '@src/middlewares/serializer.middleware'
import { withValidIdSchema } from '@src/schemas/common.schema'
import {
  createReviewSchema,
  updateReviewSchema,
} from '@src/schemas/review.schema'

const reviewRouter = Router()

reviewRouter.get('', ReviewController.getBests)

reviewRouter.get(
  '/:id',
  serialize(withValidIdSchema),
  ReviewController.getDetails,
)

reviewRouter.get('/user/:userId', ReviewController.getByUserId)

reviewRouter.get('/field/:fieldId', ReviewController.getByFieldId)

reviewRouter.use(deserializeUser)

reviewRouter.post('', serialize(createReviewSchema), ReviewController.create)

reviewRouter.patch('', serialize(updateReviewSchema), ReviewController.update)

reviewRouter.delete(
  '/:id',
  serialize(withValidIdSchema),
  ReviewController.delete_,
)

export default reviewRouter
