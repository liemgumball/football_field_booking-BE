import { IReq, IRes } from '@src/types/express/misc'

import * as UserService from '@src/services/user.service'
import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import EnvVars from '@src/constants/EnvVars'
import { TUser } from '@src/types'
import { signJWT, verifyJWT } from '@src/util/jwt'
import { sendEmail } from '@src/util/node-mailer'

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
    return res.status(HttpStatusCodes.UNAUTHORIZED).send('Account not verified')

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

  const verifyUrl = `${EnvVars.BaseUrl}/api/auth/${user._id as unknown as string}/verify/${token}`

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
 * @method PATCH
 * @param req.params.id User ID.
 * @param req.params.token Token to verify.
 */
export async function verify(req: IReq, res: IRes) {
  const { id, token } = req.params

  const isValid = verifyJWT(token)

  if (!isValid)
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send('Verify token has expired')

  const user = await UserService.getById(id)

  if (!user) return res.status(HttpStatusCodes.NOT_FOUND).send('User not found')

  await UserService.verify(id)

  return res.status(HttpStatusCodes.CREATED).end()
}
