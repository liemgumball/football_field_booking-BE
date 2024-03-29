/**
 * Environments variables declared here.
 */

import { ConnectOptions } from 'mongoose'

/* eslint-disable node/no-process-env */

export default {
  NodeEnv: process.env.NODE_ENV ?? '',
  Port: process.env.PORT ?? 0,
  CookieProps: {
    Key: 'FootBallField',
    Secret: process.env.COOKIE_SECRET ?? '',
    // Casing to match express cookie options
    Options: {
      httpOnly: true,
      signed: true,
      path: process.env.COOKIE_PATH ?? '',
      maxAge: Number(process.env.COOKIE_EXP ?? 24 * 60 * 60 * 1000),
      domain: process.env.COOKIE_DOMAIN ?? '',
      secure: process.env.SECURE_COOKIE === 'true',
    },
  },
  Jwt: {
    Secret: process.env.JWT_SECRET ?? '',
    Exp: process.env.COOKIE_EXP ?? '', // exp at the same time as the cookie
  },
  Session: {
    Secret: process.env.SESSION_SECRET ?? '',
    Exp: process.env.COOKIE_EXP ?? '', // exp at the same time as the cookie
  },
  Database: {
    uri: process.env.MONGODB_URI ?? '',
    options: {
      dbName: process.env.MONGODB_BD_NAME ?? '',
    } as ConnectOptions,
  },
  SuperUser: {
    email: process.env.SUPER_USER_EMAIL ?? '',
    password: process.env.SUPER_USER_PASSWORD ?? '',
    phoneNumber: process.env.SUPER_USER_PHONE_NUMBER ?? '',
  },
} as const
