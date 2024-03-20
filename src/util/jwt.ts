import EnvVars from '@src/constants/EnvVars'
import jwt from 'jsonwebtoken'

export function signJWT(payload: object | string | Buffer) {
  return jwt.sign(payload, EnvVars.Jwt.Secret, { expiresIn: EnvVars.Jwt.Exp })
}

export function verifyJWT(token: string) {
  let result

  jwt.verify(token, EnvVars.Jwt.Secret, (err, decoded) => {
    if (err) {
      throw err
    }
    result = decoded
  })

  return result as unknown
}
