import { LocationModel } from '@src/models/location.model'
import { TLocation } from '@src/types'

export function create(data: TLocation) {
  return LocationModel.create(data)
}
