import * as e from 'express'

// import { ISessionUserE } from '@src/models/UserExample'

// **** Express **** //

export interface IReq<T = void> extends e.Request {
  body: T
  signedCookies: {
    access_token?: string
  }
}

export interface IRes extends e.Response {
  locals: {
    //
  }
}
