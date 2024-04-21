// Model
import DayOfServiceModel from '@src/models/day-of-service.model'
import * as LocationService from '@src/services/location.service'

// Constants
import EnvVars from '@src/constants/EnvVars'
import {
  TDayOfService,
  TSubField,
  TTurnOfService,
  TurnOfServiceStatus,
} from '@src/types'

// Utilities
import { getAutoGenerateDate, getTomorrow } from '@src/util/date'
import {
  checkTurnOfServiceStatus,
  getListTurnOfServices,
  updateTurnOfServices,
} from '@src/util/turn-of-service'
import { ClientSession, PipelineStage, Types } from 'mongoose'
import { getDateList } from '@src/util/date'
import SubFieldModel from '@src/models/subfield.model'
import { wait } from '@src/util/common'

export function getById(id: string, from?: string, to?: string) {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        _id: new Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: 'footballfields',
        localField: 'fieldId',
        foreignField: '_id',
        as: 'field',
      },
    },
    {
      $lookup: {
        from: 'subfields',
        localField: 'subfieldId',
        foreignField: '_id',
        as: 'subfield',
      },
    },
    {
      $project: {
        date: 1,
        field: { $arrayElemAt: ['$field', 0] },
        subfield: { $arrayElemAt: ['$subfield', 0] },
      },
    },
    {
      $lookup: {
        from: 'locations',
        localField: 'field._id',
        foreignField: '_id',
        as: 'field.location',
      },
    },
    {
      $project: {
        subfield: 1,
        date: 1,
        field: {
          name: 1,
          openedAt: 1,
          closedAt: 1,
          rating: 1,
          images: 1,
          location: { $arrayElemAt: ['$field.location', 0] },
        },
      },
    },
    {
      $unset: [
        '__v',
        'expireAt',
        'turnOfServices.bookingId',
        'fieldId',
        'subfieldId',
      ],
    },
    {
      $project: {
        field: {
          'location.__v': 0,
          'location._id': 0,
        },
        subfield: {
          fieldId: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          defaultPrice: 0,
        },
      },
    },
    { $limit: 1 },
  ]

  // Check if 'from' exists
  if (from) {
    pipeline.push(
      {
        $addFields: {
          matchedTurnOfServices: {
            $filter: {
              input: '$turnOfServices',
              as: 'turnOfService',
              cond: {
                $and: [
                  { $gte: ['$$turnOfService.at', from] },
                  { $lt: ['$$turnOfService.at', to ? to : '24:00'] },
                  {
                    $eq: [
                      '$$turnOfService.status',
                      TurnOfServiceStatus.AVAILABLE,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          field: 1,
          subfield: 1,
          date: 1,
          turnOfServices: '$matchedTurnOfServices',
        },
      },
    )
  }

  return DayOfServiceModel.aggregate(pipeline).then(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    (result) => result.at(0) || null,
  )
}

// FIXME Fix the response data. It's too large and included some unnecessary date
export function getByFieldId(id: Types.ObjectId) {
  return DayOfServiceModel.find(
    {
      fieldId: id,
      availability: true,
      'turnOfServices.status': { $eq: TurnOfServiceStatus.AVAILABLE },
    },
    { __v: 0, turnOfServices: 0 },
    { limit: 30 },
  )
}

// FIXME Fix the response data. It's too large and included some unnecessary date
export function getBySubFieldId(id: Types.ObjectId) {
  return DayOfServiceModel.find(
    { subfieldId: id, availability: true },
    { __v: 0, turnOfServices: 0 },
    { limit: 30 },
  )
}

/**
 * Get list day of service and turn of services matched
 * @param date
 * @param from
 * @param latitude
 * @param longitude
 * @param distance
 * @param to
 * @param size
 */
export async function getManyAvailable(
  date: Date,
  from: string,
  latitude?: string,
  longitude?: string,
  distance?: number,
  to?: string,
  size?: string,
  cursor?: number,
) {
  /**
   * If fieldIds provided then query `$in` the fieldIds list
   */
  let fieldIds = null

  if (longitude && latitude)
    fieldIds = await LocationService.getFieldIdNearFromLocation(
      [+longitude, +latitude],
      distance,
    )

  const query = {
    ...(fieldIds != null && { fieldId: { $in: fieldIds } }),
    date: date,
    availability: true,
    turnOfServices: {
      $elemMatch: {
        at: { $gte: from, $lt: to ? to : '24:00' },
        status: TurnOfServiceStatus.AVAILABLE,
      },
    },
  }

  const pipeline = [
    {
      $match: query,
    },
    {
      $addFields: {
        matchedTurnOfServices: {
          $filter: {
            input: '$turnOfServices',
            as: 'turnOfService',
            cond: {
              $and: [
                { $gte: ['$$turnOfService.at', from] },
                { $lt: ['$$turnOfService.at', to ? to : '24:00'] },
                {
                  $eq: [
                    '$$turnOfService.status',
                    TurnOfServiceStatus.AVAILABLE,
                  ],
                },
              ],
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: 'footballfields',
        localField: 'fieldId',
        foreignField: '_id',
        as: 'field',
      },
    },
    {
      $lookup: size
        ? {
            from: 'subfields',
            let: { subfieldId: '$subfieldId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$subfieldId'] },
                      { $eq: ['$size', +size] },
                    ],
                  },
                },
              },
            ],
            as: 'subfield',
          }
        : {
            from: 'subfields',
            localField: 'subfieldId',
            foreignField: '_id',
            as: 'subfield',
          },
    },
    {
      $match: {
        subfield: { $ne: [] },
      },
    },
    {
      $project: {
        field: { $arrayElemAt: ['$field', 0] },
        subfield: { $arrayElemAt: ['$subfield', 0] },
        _id: 1,
        date: 1,
        turnOfServices: '$matchedTurnOfServices',
      },
    },
    {
      $project: {
        field: {
          subfieldIds: 0,
          adminId: 0,
          isActive: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
        subfield: {
          fieldId: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          defaultPrice: 0,
        },
      },
    },
  ] as PipelineStage[]

  if (cursor !== undefined) {
    pipeline.push({ $skip: cursor * 12 })
    pipeline.push({ $limit: 3 })
  } else {
    pipeline.push({ $limit: 60 })
  }

  return DayOfServiceModel.aggregate(pipeline)
}

export function generateOnCreate(
  fieldId: Types.ObjectId,
  subfieldId: Types.ObjectId,
  defaultPrice: number,
  fieldOpenTime: string,
  fieldCloseTime: string,
  session?: ClientSession,
) {
  const turnOfServices = getListTurnOfServices(
    fieldOpenTime,
    fieldCloseTime,
    defaultPrice,
  )

  if (!turnOfServices) return null

  const tomorrow = getTomorrow()

  const dates: Array<
    Omit<
      TDayOfService,
      '_id' | 'availability' | 'turnOfServices' | 'expireAt'
    > & {
      turnOfServices: Partial<TTurnOfService>[]
    }
  > = Array.from(
    { length: EnvVars.Rules.DayOfService.rangeDays - 1 }, // start from tomorrow to range day
    (_, i) => i,
  ).map((value) => {
    const date = new Date(tomorrow.getTime() + value * 24 * 60 * 60 * 1000) // 1 day
    return {
      fieldId: fieldId,
      subfieldId: subfieldId,
      date: date,
      turnOfServices: turnOfServices,
    }
  })

  return DayOfServiceModel.insertMany(dates, { session })
}

export async function autoGenerate() {
  const generateDate = getAutoGenerateDate()
  const existed = await DayOfServiceModel.findOne({ date: generateDate })

  if (existed)
    throw new Error(
      `Day of services at ${generateDate.toISOString()} already exists`,
    )

  const subfields = (await SubFieldModel.find().populate('field', {
    openedAt: 1,
    closedAt: 1,
  })) as TSubField[]

  if (!subfields) return

  try {
    subfields.forEach(async (subfield, index) => {
      // wait to limit the volume access to database
      await wait(index)
      // get latest data based on subfield
      const found = await DayOfServiceModel.findOne(
        {
          subfieldId: subfield._id,
        },
        {},
        { sort: { date: -1 } },
      )

      if (found && found.date >= generateDate) return // if already exists

      // generate day of service
      await DayOfServiceModel.insertMany(
        getDateList(found?.date || new Date(), generateDate).map((item) => ({
          fieldId: subfield.fieldId,
          subfieldId: subfield._id,
          date: item,
          turnOfServices: getListTurnOfServices(
            subfield.field!.openedAt,
            subfield.field!.closedAt,
            subfield.defaultPrice,
          ),
        })),
      )
    })
  } catch (err) {
    throw new Error(
      'Auto generate DayOfService ERROR: ' + (err as Error).message,
    )
  }
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

export async function checkValidUpdate(
  date: Date,
  subfieldId: string,
  from: string,
  to: string,
  status: TurnOfServiceStatus,
) {
  const found = await DayOfServiceModel.findOne({
    date: date,
    subfieldId: subfieldId,
  }).exec()

  if (!found) return false

  return checkTurnOfServiceStatus(found.turnOfServices, from, to, status)
}

export function addBookingId(
  bookingId: string | null,
  subfieldId: string,
  date: Date,
  from: string,
  to: string,
  status: TurnOfServiceStatus,
) {
  return DayOfServiceModel.updateOne(
    { subfieldId: subfieldId, date: date },
    {
      $set: {
        'turnOfServices.$[ele].status': status,
        'turnOfServices.$[ele].bookingId': bookingId,
      },
    },
    {
      arrayFilters: [{ 'ele.at': { $gte: from, $lt: to } }],
    },
  )
}
