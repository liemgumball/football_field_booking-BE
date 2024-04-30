import { Router } from 'express'

import * as PaymentController from '@src/controllers/payment.controller'
import Paths from '@src/constants/Paths'

const paymentRouter = Router()

// Deserialization schema

paymentRouter.post('', PaymentController.checkoutVNPay)

paymentRouter.get(Paths.CHECKOUT.RETURN, PaymentController.returnCheckout)

export default paymentRouter
