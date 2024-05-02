import * as ReviewService from '@src/services/review.service'
import * as FootballFieldService from '@src/services/football-field.service'

import { checkExactUser } from '@src/util/authorize'

import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { TReview } from '@src/types'
import { IReq, IRes } from '@src/types/express/misc'

/**
 * Get some best reviews from customers.
 * @method GET
 */
export async function getBests(_: IReq, res: IRes) {
  const reviews = await ReviewService.getBestReviews()

  return res.status(HttpStatusCodes.OK).json(reviews)
}

/**
 * Get details of a review by its ID.
 * @method GET
 * @param req.params.id - The ID of the review.
 */
export async function getDetails(req: IReq, res: IRes) {
  const { id } = req.params

  const review = await ReviewService.getById(id)

  if (!review)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Review not found')

  return res.status(HttpStatusCodes.OK).json(review)
}

/**
 * Get all reviews of a user by their ID.
 * @method GET
 * @param req.params.userId - The ID of the user.
 */
export async function getByUserId(req: IReq, res: IRes) {
  const { userId } = req.params

  const reviews = await ReviewService.getByUserId(userId)

  return res.status(HttpStatusCodes.OK).json(reviews)
}

/**
 * Get all reviews of a football field by its ID.
 * @method GET
 * @param {string} req.params.fieldId - The ID of the football field.
 */
export async function getByFieldId(req: IReq, res: IRes) {
  const { fieldId } = req.params

  const reviews = await ReviewService.getByFieldId(fieldId)

  return res.status(HttpStatusCodes.OK).json(reviews)
}

/**
 * Create a new review.
 * @method POST
 * @param req.body - The review object to create.
 */
export async function create(req: IReq<TReview>, res: IRes) {
  const review = req.body

  if (!checkExactUser(review.userId, req.user))
    return res.status(HttpStatusCodes.FORBIDDEN).end()

  const field = await FootballFieldService.getById(
    review.fieldId as unknown as string,
  )

  if (!field)
    return res.status(HttpStatusCodes.BAD_REQUEST).send('Field not found')

  const created = await ReviewService.create(review)

  if (!created) return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end()

  return res.status(HttpStatusCodes.CREATED).json(created)
}

/**
 * Update an existing review.
 * @method PATCH
 * @param req.params.id - The ID of the review to update.
 * @param req.body - The partial review object to update.
 */
export async function update(req: IReq<Partial<TReview>>, res: IRes) {
  const { id } = req.params

  const found = await ReviewService.getById(id)

  if (!found)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Review not found')

  if (!checkExactUser(found.userId, req.user))
    return res.status(HttpStatusCodes.FORBIDDEN).end()

  const updated = await ReviewService.update(id, req.body)

  if (!updated?.isModified)
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .send('Failed to update')

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}

/**
 * Delete a review by its ID.
 * @method DELETE
 * @param req.params.id - The ID of the review to delete.
 */
export async function delete_(req: IReq, res: IRes) {
  const { id } = req.params

  const found = await ReviewService.getById(id)

  if (!found)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Review not found')

  const removed = await ReviewService.remove(id)

  if (!removed?.$isDeleted)
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .send('Failed to delete')

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}
