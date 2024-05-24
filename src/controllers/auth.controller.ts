import { IReq, IRes } from '@src/types/express/misc'

import * as UserService from '@src/services/user.service'
import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import EnvVars from '@src/constants/EnvVars'
import { TGoogleOAuthCredential, TUser, UserRole } from '@src/types'
import { signJWT, verifyJWT } from '@src/util/jwt'
import { getMailContent, sendEmail } from '@src/util/mailer'
import { TokenExpiredError, decode } from 'jsonwebtoken'
import z from 'zod'

/**
 * Handle Login for Client User.
 * @method POST
 * @param req.params.email
 * @param req.params.password
 */
export async function clientLogin(req: IReq<TUser>, res: IRes) {
  const { email, password } = req.body

  const auth = await UserService.validateLogin(email, password)

  if (!auth)
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .send('Wrong username or password')

  if (auth === 'not_verified')
    return res.status(HttpStatusCodes.FORBIDDEN).send('Account not verified.')

  // admin account can not login from this endpoint
  if (auth.role === UserRole.ADMIN)
    return res
      .status(HttpStatusCodes.FORBIDDEN)
      .send('Admin account not allowed.')

  const { token } = auth

  res.cookie('access_token', token, EnvVars.CookieProps.Options)
  return res.status(HttpStatusCodes.OK).json(auth)
}

/**
 * Handle Login User.
 * @method POST
 * @param req.params.email
 * @param req.params.password
 */
export async function adminLogin(req: IReq<TUser>, res: IRes) {
  const { email, password } = req.body

  const auth = await UserService.validateLogin(email, password)

  if (!auth)
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .send('Wrong username or password')

  // client users can not login from this endpoint
  if (auth === 'not_verified')
    return res
      .status(HttpStatusCodes.FORBIDDEN)
      .send('Client user is not allowed.')

  const { token } = auth

  res.cookie('access_token', token, EnvVars.CookieProps.Options)
  return res.status(HttpStatusCodes.OK).json(auth)
}

/**
 * Handle Sign up new user.
 * @method POST
 * @param req.body Signup data.
 */
export async function signup(req: IReq<TUser>, res: IRes) {
  const user = req.body

  try {
    const created = await UserService.create(user)
    const token = signJWT({ _id: created._id as string }, 60 * 60) // 1 Hour

    const verifyUrl = `${EnvVars.ClientUrl}/verify-account/${token}`

    const mailContent = getMailContent(verifyUrl)
    await sendEmail(created.email, 'Verify account email', mailContent)
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(HttpStatusCodes.BAD_REQUEST).json(err.errors)

    return res
      .status(HttpStatusCodes.EXPECTATION_FAILED)
      .send((err as Error).message)
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
  const mailContent = getMailContent(verifyUrl)

  try {
    await sendEmail(user.email, 'Verify account email', mailContent)
  } catch (error) {
    return res
      .status(HttpStatusCodes.EXPECTATION_FAILED)
      .send((error as Error).message)
  }

  return res.status(HttpStatusCodes.CREATED).end()
}

export async function googleLogin(
  req: IReq<{ credential: string }>,
  res: IRes,
) {
  const googleCredential = decode(req.body.credential) as TGoogleOAuthCredential

  if (!googleCredential.email_verified)
    return res.status(HttpStatusCodes.UNAUTHORIZED).send('Email not verified')

  const found = await UserService.loginByGoogleId(googleCredential.sub)

  if (found) return res.status(HttpStatusCodes.OK).json(found)

  // create a new google account
  const user = await UserService.create({
    name: googleCredential.name,
    email: googleCredential.email,
    googleId: googleCredential.sub,
    phoneNumber: null,
    role: UserRole.CUSTOMER,
    avatar: googleCredential.picture,
    verified: true,
  })

  if (!user)
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .send('Fail to login by Google Account')

  return res.status(HttpStatusCodes.CREATED).json(user)
}
