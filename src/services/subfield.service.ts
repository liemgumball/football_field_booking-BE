import SubFieldModel from '@src/models/subfield.model'
import { TSubField } from '@src/types'
import * as DayOfServiceService from '@src/services/day-of-service.service'
import { Types, startSession } from 'mongoose'
import FootballFieldModel from '@src/models/football-field.model'

export function getAll() {
  return SubFieldModel.find()
}

export function getById(id: string) {
  return SubFieldModel.findById(id)
}

/**
 * Create a new `SubField` including generating `Days of service`
 * @param data Data of subfield
 */
export async function create(data: TSubField) {
  const session = await startSession()
  session.startTransaction()

  try {
    const field = await FootballFieldModel.findById(
      data.fieldId as unknown as string,
      null,
      { session },
    )

    if (!field) {
      throw new Error('Football field ID not found')
    }

    const newSubField = new SubFieldModel(data)
    await newSubField.save({ session })

    await DayOfServiceService.generateOnCreate(
      field._id,
      newSubField._id as Types.ObjectId,
      newSubField.defaultPrice,
      field.openedAt,
      field.closedAt,
      session,
    )

    await FootballFieldModel.findByIdAndUpdate(
      data.fieldId as unknown as string,
      { $push: { subfieldIds: newSubField._id as Types.ObjectId } },
      { session },
    )

    await session.commitTransaction()
    session.endSession()

    return newSubField
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw new Error((error as Error).message || 'Failed to create subfield')
  }
}

export function update(id: string, data: Partial<TSubField>) {
  return SubFieldModel.findByIdAndUpdate(id, data)
}
