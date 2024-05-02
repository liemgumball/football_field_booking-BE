import { IReq, IRes } from '@src/types/express/misc'

import * as UserService from '@src/services/user.service'
import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import EnvVars from '@src/constants/EnvVars'
import { TUser } from '@src/types'

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
  await UserService.create(user)

  return res.status(HttpStatusCodes.CREATED).end()
}
