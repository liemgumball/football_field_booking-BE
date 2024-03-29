import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import * as FootballFieldService from '@src/services/football-field.service'
import * as SubFieldService from '@src/services/subfield.service'
import { TSubField } from '@src/types'
import { IReq, IRes } from '@src/types/express/misc'

// [ ] should be transaction
export async function createSubField(req: IReq<TSubField>, res: IRes) {
  const { fieldId } = req.params

  const field = await FootballFieldService.getById(fieldId)

  if (!field)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Field not found')

  const subfield = req.body

  const newSubField = await SubFieldService.create({
    ...subfield,
    fieldId: field._id,
  })

  if (!newSubField)
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end()
  // Add subfield into field
  else
    await FootballFieldService.update(field._id.toString(), {
      subfieldIds: [...field.subfieldIds, newSubField._id],
    })

  return res.status(HttpStatusCodes.CREATED).json(newSubField)
}

/**
 * Update Subfield (not included Days of service)
 * @param req
 * @param res
 * @returns
 */
export async function updateSubfield(req: IReq<Partial<TSubField>>, res: IRes) {
  const { id } = req.params

  const found = await SubFieldService.getById(id)
  if (!found)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Subfield not found')

  // Handle update subfield
  const subfield = req.body
  const updated = await SubFieldService.update(id, subfield)

  if (!updated) return res.status(HttpStatusCodes.CONFLICT).end()

  return res.status(HttpStatusCodes.NO_CONTENT).end()
}
