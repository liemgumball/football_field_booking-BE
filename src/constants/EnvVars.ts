/**
 * Environments variables declared here.
 */
/* eslint-disable node/no-process-env */

import { ConnectOptions } from 'mongoose'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export default {
  BaseUrl: 'http://localhost:3000',
  NodeEnv: process.env.NODE_ENV ?? '',
  Port: process.env.PORT ?? 0,
  AllowedOriginPatterns:
    process.env.ALLOWED_ORIGIN_PATTERNS?.split(',').map(
      (pattern) => new RegExp(pattern),
    ) ?? [],
  AllowedOrigins:
    process.env.ALLOWED_ORIGINS?.split(',').map((origin) => origin) ?? [],
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
      sameSite: process.env.SECURE_COOKIE === 'true' ? 'none' : undefined,
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
      connectTimeoutMS: 2 * 1000,
      dbName: process.env.MONGODB_BD_NAME ?? '',
    } as ConnectOptions,
  },
  SuperUser: {
    email: process.env.SUPER_USER_EMAIL ?? '',
    password: process.env.SUPER_USER_PASSWORD ?? '',
    phoneNumber: process.env.SUPER_USER_PHONE_NUMBER ?? '',
  },
  Rules: {
    DayOfService: {
      rangeDays: Number(process.env.DAY_OF_SERVICE_RANGE) ?? 30,
      expireDays: Number(process.env.DAY_OF_SERVICE_EXPIRE) ?? 30,
      generateSchedule: process.env.DAY_OF_SERVICE_AUTO_GENERATE_CRON ?? '',
    },
  },
  VNPay: {
    vnp_TmnCode: process.env.vnp_TmnCode ?? '',
    vnp_HashSecret: process.env.vnp_HashSecret ?? '',
    vnp_Url: process.env.vnp_Url ?? '',
    vnp_ReturnUrl: process.env.vnp_ReturnUrl ?? '',
    checkoutReturn_Url: process.env.CHECKOUT_RETURN_URL ?? '',
  },
  MailTransporter: {
    host: process.env.MAIL_HOSTNAME ?? '',
    service: process.env.MAIL_SERVICE ?? '',
    port: Number(process.env.MAIL_PORT) ?? '',
    secure: Boolean(process.env.MAIL_SECURE === 'true') || false,
    auth: {
      user: process.env.MAIL_USERNAME ?? '',
      pass: process.env.MAIL_PASSWORD ?? '',
    },
    tls: {
      rejectUnauthorized: false,
    },
  } as SMTPTransport.Options,
} as const
