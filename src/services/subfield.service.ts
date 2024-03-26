import { SubFieldModel } from '@src/models/subfield.model'
import { TSubField } from '@src/types'
import * as FootballFieldService from '@src/services/football-field.service'
import * as DayOfServiceService from '@src/services/day-of-service.service'
import { Types } from 'mongoose'

export function getById(id: string) {
  return SubFieldModel.findById(id)
}

/**
 * Create a new `SubField` including generating `Days of service`
 * // FIXME should be transaction
 * @param data Data of subfield
 */
export async function create(data: TSubField) {
  try {
    const field = await FootballFieldService.getById(
      data.fieldId as unknown as string,
    )

    if (!field) {
      throw new Error('Football field ID not found')
    }

    const newSubField = new SubFieldModel(data)
    await newSubField.save()

    await DayOfServiceService.generate30({
      fieldId: field._id,
      subfieldId: newSubField._id as Types.ObjectId,
      defaultPrice: newSubField.defaultPrice,
      fieldOpenTime: field.openedAt,
      fieldCloseTime: field.closedAt,
    })

    return newSubField
  } catch (error) {
    throw new Error((error as Error).message || 'Failed to create subfield')
  }
}

export function update(id: string, data: Partial<TSubField>) {
  return SubFieldModel.findByIdAndUpdate(id, data)
}
