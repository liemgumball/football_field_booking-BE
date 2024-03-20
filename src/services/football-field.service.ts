import { FootballFieldModel } from '@src/models/football-field.model'
import * as LocationService from '@src/services/location.service'
import { TFootballField } from '@src/types'

export function getAll() {
  return FootballFieldModel.find({}).populate('admin', { email: 1 }).select({
    _id: 1,
    name: 1,
    location: 1,
    location_text: 1,
    rating: 1,
    images: 1,
    admin: 1,
  })
}

export function getById(id: string) {
  return FootballFieldModel.findById(id)
}

export async function create(data: TFootballField) {
  const { location, ...field } = data
  const newField = await FootballFieldModel.create(field)
  const newLocation = await LocationService.create({
    ...location,
    _id: newField._id,
  })

  return { ...newField, location: newLocation }
}

export function delete_(id: string) {
  return FootballFieldModel.findByIdAndDelete(id)
}

export function update(id: string, data: TFootballField) {
  return FootballFieldModel.findByIdAndUpdate(id, data)
}
