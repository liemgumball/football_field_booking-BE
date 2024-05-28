import moment from 'moment'
import querystring from 'qs'
import crypto from 'crypto'

// Services
import * as BookingService from '@src/services/booking.service'

// Utils
import { sortObject } from '@src/utils/common'

// Constants & Types
import { IReq, IRes } from '@src/types/express/misc'
import EnvVars from '@src/constants/EnvVars'
import { VNPayMsg } from '@src/constants/VNPayStatusMessage'
import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { TCheckoutSession } from '@src/types'

/**
 * Handles return response from `VNPay`
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
    const bookingId = vnp_Params['vnp_OrderInfo']

    // Get booking Id from order info
    const checkoutSession: TCheckoutSession = {
      amount: Number(vnp_Params['vnp_Amount']),
      orderId: vnp_Params['vnp_TxnRef'],
      orderBankCode: vnp_Params['vnp_BankCode'],
      orderType: '160000',
      currCode: vnp_Params['vnp_CurrCode'] as unknown as 'VND',
      statusCode: vnp_Params['vnp_ResponseCode'] as keyof typeof VNPayMsg,
      payDate: moment(vnp_Params['vnp_PayDate'], 'YYYYMMDDHHmmss').toDate(),
    }

    // Checkout successfully
    if (
      checkoutSession.statusCode === '00' ||
      checkoutSession.statusCode === '07'
    ) {
      const updated = await BookingService.payBooking(
        bookingId,
        checkoutSession,
      )

      if (!updated)
        return res
          .status(HttpStatusCodes.PRECONDITION_FAILED)
          .send('Failed to update booking payment')
    } else {
      // Checkout failed
      const updated = await BookingService.update(bookingId, {
        checkoutSession: null,
      })

      if (!updated)
        return res
          .status(HttpStatusCodes.PRECONDITION_FAILED)
          .send('Failed to update booking payment')
    }

    // Redirect user to payment page
    return res.redirect(
      `${EnvVars.VNPay.checkoutReturn_Url}/${bookingId}?statusCode=${checkoutSession.statusCode}`,
    )
  } else {
    // This should never happened
    return res.redirect(`${EnvVars.VNPay.checkoutReturn_Url}?notSigned=true`)
  }
}
