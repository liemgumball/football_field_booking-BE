import EnvVars from '@src/constants/EnvVars'
import jwt from 'jsonwebtoken'

/**
 * Signs a JSON Web Token (JWT) with the given payload.
 * @param {object | string | Buffer} payload - The payload to be signed.
 * @returns {string} The signed JWT.
 */
export function signJWT(payload: object | string | Buffer): string {
  return jwt.sign(payload, EnvVars.Jwt.Secret, { expiresIn: EnvVars.Jwt.Exp })
}

/**
 * Verifies a JSON Web Token (JWT) and returns the decoded payload.
 * @param {string} token - The JWT to verify.
 * @throws {Error} If the token is invalid or expired.
 */
export function verifyJWT(token: string) {
  let result

  jwt.verify(token, EnvVars.Jwt.Secret, (err, decoded) => {
    if (err) {
      throw err
    }
    result = decoded
  })

  return result as unknown as string | jwt.JwtPayload | undefined
}
