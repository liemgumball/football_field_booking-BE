import FootballFieldModel from '@src/models/football-field.model'
import LocationModel from '@src/models/location.model'
import UserModel from '@src/models/user.model'
import { TFootballField, TUser } from '@src/types'
import { Types, startSession } from 'mongoose'

export function getAll(
  options: { name?: string; rating?: number | null } = {},
) {
  const { name, rating } = options

  const query: Record<string, unknown> = {}

  if (name) query['name'] = name
  if (rating) query['rating'] = { $gte: rating }

  return FootballFieldModel.find(query)
    .select('_id name is_active availability rating images opened_at closed_at')
    .limit(30)
}

export function getById(id: string) {
  return FootballFieldModel.findById(id)
    .populate('subfields')
    .populate('location')
}

export function getBySubfieldId(subfieldId: Types.ObjectId) {
  return FootballFieldModel.findOne({ subfieldIds: subfieldId })
}

export function getByAdminId(adminId: string) {
  return FootballFieldModel.findOne({ adminId: adminId })
}

export async function create(
  data: Omit<TFootballField, 'adminId'>,
  admin: TUser,
) {
  const session = await startSession()

  try {
    session.startTransaction()

    const newAdmin = new UserModel(admin)
    await newAdmin.save({ session })

    const { location, ...field } = data
    const newField = new FootballFieldModel({
      ...field,
      adminId: newAdmin.id as Types.ObjectId,
    })
    await newField.save({ session })

    const newLocation = new LocationModel({
      ...location,
      _id: newField._id,
    })
    await newLocation.save({ session })

    await session.commitTransaction()
    session.endSession()

    return {
      ...newField.toJSON(),
      location: newLocation.toJSON(),
      admin: newAdmin.email,
    }
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    throw new Error(
      (error as Error).message || 'Failed to create football field',
    )
  }
}

export function delete_(id: string) {
  return FootballFieldModel.findByIdAndDelete(id)
}

export function update(id: string, data: Partial<TFootballField>) {
  return FootballFieldModel.findByIdAndUpdate(id, data)
}

export function addImage(id: string, imageUrls: string[]) {
  return FootballFieldModel.findByIdAndUpdate(
    id,
    {
      $addToSet: {
        images: { $each: [...imageUrls] },
      },
    },
    { includeResultMetadata: true },
  )
}
