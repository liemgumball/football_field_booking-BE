import { Router } from 'express'

import * as PaymentController from '@src/controllers/payment.controller'

/**
 * This router is Endpoint for VNPay
 */
const paymentRouter = Router()

paymentRouter.get('/return', PaymentController.returnCheckout)

export default paymentRouter
