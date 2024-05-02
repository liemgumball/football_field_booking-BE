import { Router } from 'express'

import * as PaymentController from '@src/controllers/payment.controller'

const paymentRouter = Router()

// Deserialization schema

paymentRouter.get('/return', PaymentController.returnCheckout)

export default paymentRouter
