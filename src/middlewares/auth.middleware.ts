import EnvVars from '@src/constants/EnvVars'
import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { IReq, IRes } from '@src/types/express/misc'
import { NextFunction } from 'express'
import jwt from 'jsonwebtoken'

function validateAuth(req: IReq, res: IRes, next: NextFunction) {
  const token = req.signedCookies.access_token

  if (!token) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .send('No authentication token provided')
  }

  jwt.verify(token, EnvVars.Jwt.Secret, (err: jwt.VerifyErrors | null) => {
    if (err) {
      return res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .send('Token is unauthenticated')
    }

    // If the token is successfully verified, call the next middleware
    next()
  })
}

export default validateAuth
