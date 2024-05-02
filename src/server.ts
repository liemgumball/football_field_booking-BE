/**
 * Setup express server.
 */

import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import path from 'path'
import helmet from 'helmet'
import cors from 'cors'
import express, { Request, Response, NextFunction } from 'express'
import logger from 'jet-logger'
import session from 'express-session'
import connectMongoDBSession from 'connect-mongodb-session'

import 'express-async-errors'

import BaseRouter from '@src/routes/api.routes'

import EnvVars from '@src/constants/EnvVars'
import HttpStatusCodes from '@src/constants/HttpStatusCodes'

import { NodeEnvs } from '@src/constants/misc'
import { RouteError } from '@src/other/classes'

// **** Variables **** //

const app = express()

// **** Setup **** //

// Basic middleware

app.use(
  cors({
    origin: (requestOrigin, callback) => {
      // Check if the origin matches or valid with any of the allowed patterns
      if (
        !requestOrigin ||
        EnvVars.AllowedOriginPatterns.some((pattern) =>
          pattern.test(requestOrigin),
        ) ||
        EnvVars.AllowedOrigins.includes(requestOrigin)
      ) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'), false)
      }
    },
    exposedHeaders: ['set-cookie', 'ajax_redirect'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(EnvVars.CookieProps.Secret))

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'))
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet())
}

// Create session data
const MongoDBSession = connectMongoDBSession(session)
const store = new MongoDBSession({
  ...EnvVars.Database.options,
  uri: EnvVars.Database.uri,
  collection: 'sessions',
})

app.use(
  session({
    secret: EnvVars.Session.Secret,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: EnvVars.CookieProps.Options,
  }),
)

// Add APIs, must be after middleware
app.use('/api', BaseRouter)

// Add error handler
app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
      logger.err(err, true)
    }
    let status = HttpStatusCodes.BAD_REQUEST
    if (err instanceof RouteError) {
      status = err.status
    }
    return res.status(status).json({ error: err.message })
  },
)

// ** Front-End Content ** //

// Set views directory (html)
const viewsDir = path.join(__dirname, 'views')
app.set('views', viewsDir)

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public')
app.use(express.static(staticDir))

// Nav to users pg by default
app.get('/', (_: Request, res: Response) => {
  return res.redirect('/users')
})

// Redirect to login if not logged in.
app.get('/users', (_: Request, res: Response) => {
  return res.sendFile('users.html', { root: viewsDir })
})

// **** Export default **** //

export default app
