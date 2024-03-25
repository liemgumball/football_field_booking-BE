import { DayOfServiceModel } from '@src/models/day-of-service.model'
import { TDayOfService } from '@src/types'

// Service
// import * as LocationService from '@src/services/location.service'
import { getListTurnOfServices } from '@src/util/turn-of-service'
import { updateTurnOfServices } from '@src/util/turn-of-service'
import { ClientSession, Types } from 'mongoose'

export function getById(id: string) {
  return DayOfServiceModel.findById(id)
}

export function getByFieldId(id: Types.ObjectId) {
  return DayOfServiceModel.find({ fieldId: id })
}

export function getBySubFieldId(id: Types.ObjectId) {
  return DayOfServiceModel.find({ subfieldId: id })
}

export function generate30(
  requires: {
    fieldId: string
    subfieldId: string
    defaultPrice: number
    fieldOpenTime: string
    fieldCloseTime: string
  },
  session: ClientSession | null = null,
) {
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

  const dates = Array.from({ length: 30 }, (_, i) => i).map((value) => {
    const date = new Date(tomorrow.getTime() + value * 24 * 60 * 60 * 1000)
    return {
      fieldId: fieldId,
      subfieldId: subfieldId,
      price: defaultPrice,
      date: date,
      turnOfServices: turnOfServices,
    }
  })

  return DayOfServiceModel.insertMany(dates, { session: session })
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

export function getByTimeRange(from: string, to: string) {
  return DayOfServiceModel.find({
    startedAt: { $gte: from, $lte: to },
  })
}

// TODO
// export async function getMany(options: {
//   latitude?: number
//   longitude?: number
//   distance?: number
//   from?: Date
//   to?: Date
// }) {
//   const { latitude, longitude, distance, from, to } = options
//   let fields: unknown

//   if (longitude && latitude) {
//     fields = await LocationService.getFieldIdNearFromLocation(
//       [longitude, latitude],
//       distance,
//     )

//     if (!fields) return fields
//   } else {
//     // fields = await FootballFieldService.getAll
//   }

//   const subfields = await DayOfServiceModel.find()
//     .populate('subfield')
//     .select({ _id: 0 })

//   // fields = await LocationModel.
//   return subfields
// }
