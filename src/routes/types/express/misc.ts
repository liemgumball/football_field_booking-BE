import * as e from 'express';

import { ISessionUserE } from '@src/models/UserExample';

// **** Express **** //

export interface IReq<T = void> extends e.Request {
  body: T;
}

export interface IRes extends e.Response {
  locals: {
    sessionUser?: ISessionUserE;
  };
}
