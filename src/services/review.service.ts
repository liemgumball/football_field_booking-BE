import ReviewModel from '@src/models/review.model'
import { TReview } from '@src/types'

export function getBestReviews() {
  return ReviewModel.find({}).sort('-rating').limit(10)
}

export function getById(id: string) {
  return ReviewModel.findById(id)
}

export function getByUserId(id: string) {
  return ReviewModel.find({ userId: id })
}

export function getByFieldId(id: string) {
  return ReviewModel.find({ fieldId: id })
}

export function create(data: TReview) {
  return ReviewModel.create(data)
}

export function update(id: string, data: Partial<TReview>) {
  return ReviewModel.findByIdAndUpdate(id, data)
}

export function remove(id: string) {
  return ReviewModel.findByIdAndDelete(id)
}
