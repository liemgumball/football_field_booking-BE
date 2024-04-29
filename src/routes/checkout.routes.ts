import { Router } from 'express'

import * as CheckoutController from '@src/controllers/checkout.controller'
import Paths from '@src/constants/Paths'

const checkoutRouter = Router()

// Deserialization schema

checkoutRouter.post('', CheckoutController.checkoutVNPay)

checkoutRouter.get(Paths.CHECKOUT.RETURN, CheckoutController.returnCheckout)

export default checkoutRouter
