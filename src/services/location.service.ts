import { LocationModel } from '@src/models/location.model'
import { TLocation, TPoint } from '@src/types'

export function create(data: TLocation) {
  return LocationModel.create(data)
}

export function getFieldIdNearFromLocation(
  point: TPoint['coordinates'],
  max: number = 1000,
) {
  return LocationModel.find(
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
  )
    .lean()
    .then((val) => val.map((item) => item._id as string))
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
