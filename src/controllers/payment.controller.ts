import moment from 'moment'
import querystring from 'qs'
import crypto from 'crypto'

// Services
import * as BookingService from '@src/services/booking.service'

// Utils
import { sortObject } from '@src/util/common'
import { parseOrderInfo } from '@src/util/vnpay'

// Constants & Types
import { IReq, IRes } from '@src/types/express/misc'
import EnvVars from '@src/constants/EnvVars'
import { VNPayMsg } from '@src/constants/VNPayStatusMessage'
import { TPayment } from '@src/types'
import HttpStatusCodes from '@src/constants/HttpStatusCodes'

/**
 * Handles return response from VNPay
 */
export async function returnCheckout(req: IReq, res: IRes) {
  let vnp_Params = req.query as Record<string, string>
  const secureHash = vnp_Params['vnp_SecureHash']

  delete vnp_Params['vnp_SecureHash']
  delete vnp_Params['vnp_SecureHashType']

  const secretKey = EnvVars.VNPay.vnp_HashSecret

  vnp_Params = sortObject(vnp_Params)
  const signData = querystring.stringify(vnp_Params, { encode: false })
  const hmac = crypto.createHmac('sha512', secretKey)
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

  if (secureHash === signed) {
    const bookingId = parseOrderInfo(vnp_Params['vnp_OrderInfo'])

    // Get booking Id from order info

    const payment: TPayment = {
      amount: Number(vnp_Params['vnp_Amount']),
      orderId: vnp_Params['vnp_TxnRef'],
      orderBankCode: vnp_Params['vnp_BankCode'],
      orderType: '160000',
      statusCode: vnp_Params['vnp_ResponseCode'] as keyof typeof VNPayMsg,
      payDate: moment(vnp_Params['vnp_PayDate'], 'YYYYMMDDHHmmss').toDate(),
    }

    const updated = await BookingService.payBooking(bookingId, payment)

    if (!updated)
      return res
        .status(HttpStatusCodes.PRECONDITION_FAILED)
        .send('Failed to update booking payment')

    // Redirect to the success page
    return res.redirect('/api/pings') // [ ] should be redirect to FE page (use EnvVariables)
  } else {
    // Should never happened
    // [ ] Redirect to the failure page
    return res.redirect('/api/pings')
  }
}
