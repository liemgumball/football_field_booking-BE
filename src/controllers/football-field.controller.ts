// Constants & Types
import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { IReq, IRes } from '@src/types/express/misc'
import { TFootballField, TUser, UserRole } from '@src/types'

// Services
import * as FootballFieldService from '@src/services/football-field.service'
import * as LocationService from '@src/services/location.service'

/**
 * Get all football field.
 * @method GET
 * @param req.query.name Name of field to search.
 */
export async function getAll(req: IReq, res: IRes) {
  const { name, rating, admin } = req.query

  const options = {
    name: typeof name === 'string' ? name : undefined,
    rating:
      typeof rating === 'string'
        ? rating === 'null'
          ? null
          : Number(rating)
        : undefined,
    withAdmin: admin === 'true' ? true : undefined,
  }

  const fields = await FootballFieldService.getAll(options)

  return res.status(HttpStatusCodes.OK).json(fields)
}

/**
 * Get all football field.
 * @method GET
 * @param req.query.name Name of field to search.
 */
export async function getBests(req: IReq, res: IRes) {
  const { limit } = req.query

  const fields = await FootballFieldService.getBests(
    typeof limit === 'string' ? Number(limit) : undefined,
  )

  return res.status(HttpStatusCodes.OK).json(fields)
}

/**
 * Get many football fields from a location and search radius.
 * @method GET
 * @param req.query.longitude
 * @param req.query.latitude
 * @param req.query.distance Search radius
 */
export async function getFromLocation(req: IReq, res: IRes) {
  const { longitude, latitude, distance } = req.query

  if (typeof longitude !== 'string' || typeof latitude !== 'string')
    return res.status(HttpStatusCodes.BAD_REQUEST).end()

  const fields = await LocationService.getFieldNearFromLocation(
    [+longitude, +latitude],
    typeof distance === 'string' ? +distance : undefined,
  )

  if (!fields) return res.status(HttpStatusCodes.NOT_FOUND).end()

  return res.status(HttpStatusCodes.OK).json(fields)
}

/**
 * Get all football field details.
 * @method GET
 * @param req.params.id Football field ID.
 */
export async function getById(req: IReq, res: IRes) {
  const { id } = req.params

  const field = await FootballFieldService.getById(id)

  if (!field)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Data not found')

  return res.status(HttpStatusCodes.OK).json(field)
}

/**
 * Get football field details by admin ID.
 * @method GET
 * @param req.params.adminId Football field ID.
 */
export async function getByAdminId(req: IReq, res: IRes) {
  const { adminId } = req.params

  if (req.user?.role === UserRole.SUPER_USER) {
    const fieldIds = await FootballFieldService.getAllId()

    if (!fieldIds.length)
      return res.status(HttpStatusCodes.NOT_FOUND).send('Data not found')

    const field = await FootballFieldService.getById(fieldIds[0].id as string)

    return res.status(HttpStatusCodes.OK).json({ fieldIds, field })
  }

  const field = await FootballFieldService.getByAdminId(adminId)

  if (!field)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Data not found')

  return res.status(HttpStatusCodes.OK).json({ field })
}

/**
 * Create new football field by super user.
 * @method POST
 * @param req.body.football_field Football data to create.
 * @param req.body.admin Admin SingUp data to create.
 */
export async function create(
  req: IReq<{ football_field: TFootballField; admin: TUser }>,
  res: IRes,
) {
  const { football_field, admin } = req.body

  const created = await FootballFieldService.create(football_field, admin)

  if (!created)
    return res
      .status(HttpStatusCodes.EXPECTATION_FAILED)
      .send('Failure creating new Football Field')

  return res.status(HttpStatusCodes.CREATED).json(created)
}

/**
 * Update football field by admin
 * @method PATCH
 * @param req.params.id
 * @param req.params.data
 */
export async function update(req: IReq<TFootballField>, res: IRes) {
  const { id } = req.params
  const data = req.body

  const updated = await FootballFieldService.update(id, data)

  if (data.location) await LocationService.update(id, data.location)

  if (!updated)
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .send('Update failed')

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}

/**
 * Add image to field
 * @method POST
 * @param req.params.fieldId Field ID.
 */
export async function addImage(req: IReq<{ images: string[] }>, res: IRes) {
  const { fieldId } = req.params

  const updated = await FootballFieldService.addImage(fieldId, req.body.images)

  if (!updated)
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .send('Fail to add image')

  if (updated.lastErrorObject?.updatedExisting)
    return res.status(HttpStatusCodes.NOT_MODIFIED).send('Image already exists')

  return res.status(HttpStatusCodes.CREATED).end()
}

/**
 * Delete football field by super user
 * @method DELETE
 * @param req.params.id
 */
export async function delete_(req: IReq, res: IRes) {
  const { id } = req.params

  const deleted = await FootballFieldService.delete_(id)

  if (!deleted)
    return res.status(HttpStatusCodes.NOT_MODIFIED).send('Failed to delete')

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}
