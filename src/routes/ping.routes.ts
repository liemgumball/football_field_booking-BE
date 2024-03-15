import { Router } from 'express'
import PingController from '@src/controllers/ping.controller'

const pingRouter = Router()

pingRouter.get('/', PingController.ping)

export default pingRouter
