import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { UserRole } from '@src/types'
import { IReq, IRes, IUserSession } from '@src/types/express/misc'
import { verifyJWT } from '@src/util/jwt'
import { NextFunction } from 'express'
import * as FootballFieldService from '@src/services/football-field.service'
import { checkAdmin } from '@src/util/authorize'

/**
 * Check and verify the JWT access token in `req.user`
 */
export function deserializeUser(req: IReq, res: IRes, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token && !token?.length) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .send('No authentication token provided')
  }

  try {
    const decoded = verifyJWT(token)

    req.user = decoded as IUserSession
    return next()
  } catch (error) {
    return res.status(HttpStatusCodes.FORBIDDEN).send(error)
  }
}

/**
 * Middleware to authenticate if the request `UserSession` is matched the `UserId`.
 * @param req.params.id User ID.
 */
export function canAccessUserDetails(req: IReq, res: IRes, next: NextFunction) {
  const { id } = req.params
  const user = req.user

  if (user?.role === UserRole.SUPER_USER) return next()

  if (user?._id !== id) {
    return res
      .status(HttpStatusCodes.FORBIDDEN)
      .send('Not allowed to access this user')
  }

  return next()
}

/**
 * Check if the current user makes the request is authenticated Super User
 */
export function isSuperUser(req: IReq, res: IRes, next: NextFunction) {
  const user = req.user
  if (user?.role !== UserRole.SUPER_USER) {
    return res
      .status(HttpStatusCodes.FORBIDDEN)
      .send('Only super users are allowed')
  }

  next()
}

/**
 * Check if the current user makes the request is authenticated Admin of Football field
 * @param req.params.fieldId Required
 */
export async function isAdmin(req: IReq, res: IRes, next: NextFunction) {
  const { fieldId, id } = req.params
  let field = undefined

  if (fieldId) field = await FootballFieldService.getById(fieldId)
  if (!fieldId && id) field = await FootballFieldService.getById(id)

  if (!field)
    return res.status(HttpStatusCodes.NOT_FOUND).send('Field not found')

  if (!checkAdmin(field.adminId, req.user))
    return res.status(HttpStatusCodes.FORBIDDEN).send('Not an administrator')

  return next()
}
