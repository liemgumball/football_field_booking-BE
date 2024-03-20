import * as e from 'express'
import { UserRole } from '..'

export interface IUserSession {
  _id: string
  role: UserRole
  iat: number
  exp: number
}

// **** Express **** //

export interface IReq<T = unknown> extends e.Request {
  body: T
  signedCookies: {
    access_token?: string
  }
  user?: IUserSession
}

export interface IRes extends e.Response {
  locals: {
    //
  }
}
