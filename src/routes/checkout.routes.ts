import { Router } from 'express'

import * as CheckoutController from '@src/controllers/checkout.controller'

const checkoutRouter = Router()

// Deserialization schema

checkoutRouter.post('', CheckoutController.checkoutVNPay)

export default checkoutRouter
