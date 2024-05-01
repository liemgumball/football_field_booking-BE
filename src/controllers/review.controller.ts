import * as ReviewService from '@src/services/review.service'
import * as FootballFieldService from '@src/services/football-field.service'

import { checkExactUser } from '@src/util/authorize'

import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { TReview } from '@src/types'
import { IReq, IRes } from '@src/types/express/misc'

export async function getBests(_: IReq, res: IRes) {
  const reviews = await ReviewService.getBestReviews()

  return res.status(HttpStatusCodes.OK).json(reviews)
}

export async function getDetails(req: IReq, res: IRes) {
  const { id } = req.params

  const review = await ReviewService.getById(id)

  if (!review)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Review not found')

  return res.status(HttpStatusCodes.OK).json(review)
}

export async function getByUserId(req: IReq, res: IRes) {
  const { userId } = req.params

  const reviews = await ReviewService.getByUserId(userId)

  return res.status(HttpStatusCodes.OK).json(reviews)
}

export async function getByFieldId(req: IReq, res: IRes) {
  const { fieldId } = req.params

  const reviews = await ReviewService.getByFieldId(fieldId)

  return res.status(HttpStatusCodes.OK).json(reviews)
}

/**
 * @method POST
 * @todo // TODO handle user only can create 1 review for 1 field
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
 * @method PATCH
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
 * @method DELETE
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
