import { IReq, IRes } from '@src/types/express/misc'

import * as UserService from '@src/services/user.service'
import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import EnvVars from '@src/constants/EnvVars'
import { TUser } from '@src/types'
import { signJWT, verifyJWT } from '@src/util/jwt'
import { sendEmail } from '@src/util/mailer'
import { TokenExpiredError } from 'jsonwebtoken'

/**
 * Handle Login User.
 * @method POST
 * @param req.params.email
 * @param req.params.password
 */
export async function login(req: IReq<TUser>, res: IRes) {
  const { email, password } = req.body

  const auth = await UserService.validateLogin(email, password)

  if (!auth)
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .send('Wrong username or password')

  if (auth === 'not_verified')
    return res.status(HttpStatusCodes.FORBIDDEN).send('Account not verified')

  const { token, ...rest } = auth

  res.cookie('access_token', token, EnvVars.CookieProps.Options)
  return res.status(HttpStatusCodes.OK).json(rest)
}

/**
 * Handle Sign up new user.
 * @method POST
 * @param req.body Signup data.
 */
export async function signup(req: IReq<TUser>, res: IRes) {
  const user = req.body

  const created = await UserService.create(user)

  const token = signJWT({ _id: created._id as string }, 60 * 60) // 1 Hour

  const verifyUrl = `${EnvVars.ClientUrl}/verify-account/${token}`

  try {
    await sendEmail(created.email, 'Verify account email', verifyUrl)
  } catch (error) {
    return res
      .status(HttpStatusCodes.EXPECTATION_FAILED)
      .send((error as Error).message)
  }

  return res.status(HttpStatusCodes.CREATED).end()
}

/**
 * Send email to verify account
 * @method GET
 * @param req.params.token Token to verify.
 */
export async function verify(req: IReq, res: IRes) {
  const { token } = req.params

  try {
    const decoded = verifyJWT(token) as { _id: string }

    const id = decoded._id

    const user = await UserService.getById(id)

    if (!user)
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .send('User can not be found by token')

    await UserService.verify(id)
    return res.status(HttpStatusCodes.OK).end()
  } catch (error) {
    if (error instanceof TokenExpiredError)
      return res.status(HttpStatusCodes.FORBIDDEN).send('Token expired')

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end()
  }
}

/**
 * Send new verify email
 * @method POST
 * @param req.body.email The email address
 */
export async function resendEmailVerify(
  req: IReq<{ email: string }>,
  res: IRes,
) {
  const { email } = req.body
  const user = await UserService.getByEmail(email)

  if (!user)
    return res.status(HttpStatusCodes.NOT_FOUND).send('User not found by email')

  if (user.verified)
    return res
      .status(HttpStatusCodes.EXPECTATION_FAILED)
      .send('Account already verified')

  const token = signJWT({ _id: user._id as string }, 60 * 60)

  const verifyUrl = `${EnvVars.ClientUrl}/verify-account/${token}`

  try {
    await sendEmail(user.email, 'Verify account email', verifyUrl)
  } catch (error) {
    return res
      .status(HttpStatusCodes.EXPECTATION_FAILED)
      .send((error as Error).message)
  }

  return res.status(HttpStatusCodes.CREATED).end()
}
