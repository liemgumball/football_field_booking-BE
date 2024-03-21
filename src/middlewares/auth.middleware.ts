import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { UserRole } from '@src/types'
import { IReq, IRes, IUserSession } from '@src/types/express/misc'
import { verifyJWT } from '@src/util/jwt'
import { NextFunction } from 'express'

/**
 * Check and verify the JWT access token to `req.user`
 */
export function deserializeUser(req: IReq, res: IRes, next: NextFunction) {
  const token = req.signedCookies.access_token

  if (!token) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .send('No authentication token provided')
  }

  try {
    const decoded = verifyJWT(token)

    req.user = decoded as IUserSession
    next()
  } catch (error) {
    return res.status(HttpStatusCodes.FORBIDDEN).send(error)
  }
}

/**
 * Middleware to authenticate if the request `UserSession` is matched the `UserId` in request parameters `/:id`
 */
export function canAccessUserDetails(req: IReq, res: IRes, next: NextFunction) {
  const { id } = req.params
  const user = req.user

  if (user?._id !== id) {
    return res.status(HttpStatusCodes.FORBIDDEN).send('Not authorized')
  }

  next()
}

export function isSuperUser(req: IReq, res: IRes, next: NextFunction) {
  const user = req.user
  if (user?.role !== UserRole.SUPER_USER) {
    return res
      .status(HttpStatusCodes.FORBIDDEN)
      .send('Only super users are allowed')
  }

  next()
}
