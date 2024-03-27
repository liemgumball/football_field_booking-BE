import DayOfServiceModel from '@src/models/day-of-service.model'
import { TDayOfService } from '@src/types'
import { getNextWeek } from '@src/util/timestep'

// Service
// import * as LocationService from '@src/services/location.service'
import {
  getListTurnOfServices,
  updateTurnOfServices,
} from '@src/util/turn-of-service'
import { Types } from 'mongoose' // FIXME too large import

export function getById(id: string) {
  return DayOfServiceModel.findById(id)
}

export function getByFieldId(id: Types.ObjectId) {
  return DayOfServiceModel.find(
    { fieldId: id, availability: true },
    {},
    { limit: 30 },
  )
}

export function getBySubFieldId(id: Types.ObjectId) {
  return DayOfServiceModel.find(
    { subfieldId: id, availability: true },
    {},
    { limit: 30 },
  )
}

export function generate30(requires: {
  fieldId: Types.ObjectId
  subfieldId: Types.ObjectId
  defaultPrice: number
  fieldOpenTime: string
  fieldCloseTime: string
}) {
  const { fieldId, subfieldId, defaultPrice, fieldOpenTime, fieldCloseTime } =
    requires

  const turnOfServices = getListTurnOfServices(
    fieldOpenTime,
    fieldCloseTime,
    defaultPrice,
  )

  if (!turnOfServices) return null

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setTime(0)

  const dates = Array.from({ length: 30 }, (_, i) => i).map((value) => {
    const date = new Date(tomorrow.getTime() + value * 24 * 60 * 60 * 1000)
    return {
      fieldId: fieldId,
      subfieldId: subfieldId,
      date: date,
      turnOfServices: turnOfServices,
    }
  })

  return DayOfServiceModel.insertMany(dates)
}

/**
 * Update Day of Service (not including turns of service)
 */
export async function updateOne(id: string, data: Partial<TDayOfService>) {
  // check if trying to update turns of service
  if (data.turnOfServices) {
    const found = await DayOfServiceModel.findById(id)
    if (!found) return null

    const newTurnOfService = updateTurnOfServices(
      found.turnOfServices,
      data.turnOfServices,
    )

    return DayOfServiceModel.findByIdAndUpdate(id, {
      turnOfServices: newTurnOfService,
    })
  }

  return DayOfServiceModel.findByIdAndUpdate(id, data)
}

/**
 * Query list of `day of service`
 * @description by default will query from `current time` to `next week`
 * @param from start of time range
 * @param to end of time range
 * @param fieldIds list of field to search from
 * @returns list of `day of service`
 */
export function getMany(
  from: Date = new Date(),
  to: Date = getNextWeek(from),
  fieldIds?: string[],
) {
  /**
   * If fieldIds provided then query `$in` the fieldIds list
   */
  const query = fieldIds
    ? {
        fieldId: { $in: fieldIds },
        date: { $gte: from, $lte: to },
        availability: true,
      }
    : {
        date: { $gte: from, $lte: to },
        availability: true,
      }
  return DayOfServiceModel.find(query, {}, { limit: 50 })
}

export function addUserId(
  subfieldId: string,
  date: Date,
  userId: string,
  from: string,
  to: string,
) {
  return DayOfServiceModel.updateOne(
    { subfieldId: subfieldId, date: date },
    {
      $set: { 'turnOfServices.$[ele].userId': userId },
    },
    {
      arrayFilters: [{ 'ele.at': { $gte: from, $lte: to } }],
    },
  )
}
