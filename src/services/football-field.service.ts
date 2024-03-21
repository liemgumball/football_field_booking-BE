import { FootballFieldModel } from '@src/models/football-field.model'
import * as LocationService from '@src/services/location.service'
import { TFootballField } from '@src/types'

export function getAll(options: { name?: string } = {}) {
  const { name } = options

  const query = name ? { name: new RegExp(name, 'gi') } : {}

  return FootballFieldModel.find(query).select(
    '_id name is_active availability rating images opened_at closed_at',
  )
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
