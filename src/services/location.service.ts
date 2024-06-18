import LocationModel from '@src/models/location.model'
import { TLocation, TPoint } from '@src/types'

export function create(data: TLocation) {
  return LocationModel.create(data)
}

export function update(id: string, data: Omit<TLocation, '_id'>) {
  return LocationModel.findByIdAndUpdate(id, data)
}

/**
 * Search 2dSphere field from a location
 * @param point `[longitude, latitude]` as `[number, number]` coordinates
 * @param max the maximum distance to search from the point
 * @returns list of field Ids
 */
export async function getFieldIdNearFromLocation(
  point: TPoint['coordinates'],
  max: number = 1000,
) {
  const val = await LocationModel.find(
    {
      geo: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: point,
          },
          $maxDistance: max,
        },
      },
    },
    {
      _id: 1,
    },
  ).lean()

  return val.map((item) => item._id as string)
}

export function getFieldNearFromLocation(
  point: TPoint['coordinates'],
  max: number = 1000,
) {
  return LocationModel.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: point,
        },
        distanceField: 'distance',
        maxDistance: max,
        spherical: true,
      },
    },
    {
      $lookup: {
        from: 'footballfields',
        localField: '_id',
        foreignField: '_id',
        as: 'field',
      },
    },
    {
      $unwind: '$field',
    },
    {
      $sort: {
        distance: 1,
      },
    },
    {
      $project: {
        _id: 1,
        field: { name: 1, rating: 1, availability: 1, subfields: 1 },
        geo: 1,
        distance: 1,
      },
    },
  ])
}
