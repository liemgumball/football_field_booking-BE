import { LocationModel } from '@src/models/location.model'
import { TLocation, TPoint } from '@src/types'

export function create(data: TLocation) {
  return LocationModel.create(data)
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
        from: 'footballfields', // Assuming the collection name is "footballfields"
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
        _id: 0, // Exclude _id field
        field: { name: 1, rating: 1 }, // Rename _id field to field
        geo: 1, // Include other fields if needed
        distance: 1, // Include distance field if needed
      },
    },
  ])
}
