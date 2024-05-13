import EnvVars from '@src/constants/EnvVars'
import { IReq } from '@src/types/express/misc'
import moment from 'moment'
import { sortObject } from './common'
import QueryString from 'qs'
import crypto from 'crypto'
import { TBooking, TCheckoutSession } from '@src/types'

export function createCheckoutSessionObject(
  booking: TBooking,
): TCheckoutSession {
  const date = new Date()

  return {
    orderId: moment(date).format('DDHHmmss'),
    amount: booking.price * 100 * 1000,
    currCode: 'VND',
    orderType: '160000',
    payDate: date,
    statusCode: null,
  }
}

/**
 * Generates the checkout URL for VNPay.
 * @param req - The request object.
 * @param bookingId - The booking ID.
 * @param checkoutSession - The TCheckoutSession object
 * @returns The checkout URL for VNPay.
 */
export function getCheckoutUrl(
  req: IReq,
  bookingId: string,
  checkoutSession: TCheckoutSession,
): string {
  const ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress

  let vnpUrl = EnvVars.VNPay.vnp_Url

  const { amount, currCode, orderId, orderType, payDate, orderBankCode } =
    checkoutSession

  const createDate = moment(payDate).format('YYYYMMDDHHmmss')
  // const expireDate = moment(
  //   payDate.setTime(payDate.getTime() + 10 * 60 * 1000),
  // ).format('YYYYMMDDHHmmss')

  // Send the bookingId as an info to update the booking data after checkout
  const locale = 'vn'
  const vnpParams: Record<string, unknown> = {}

  vnpParams['vnp_Version'] = '2.1.0'
  vnpParams['vnp_Command'] = 'pay'
  vnpParams['vnp_TmnCode'] = EnvVars.VNPay.vnp_TmnCode
  // vnpParams['vnp_Merchant'] = ''
  vnpParams['vnp_Locale'] = locale
  vnpParams['vnp_CurrCode'] = currCode
  vnpParams['vnp_TxnRef'] = orderId
  vnpParams['vnp_OrderInfo'] = bookingId
  vnpParams['vnp_OrderType'] = orderType
  vnpParams['vnp_Amount'] = amount
  vnpParams['vnp_ReturnUrl'] = EnvVars.VNPay.vnp_ReturnUrl
  vnpParams['vnp_IpAddr'] = ipAddr
  vnpParams['vnp_CreateDate'] = createDate
  // vnpParams['vnp_ExpireDate'] = expireDate

  if (orderBankCode) {
    vnpParams['vnp_BankCode'] = orderBankCode
  }

  const sortedParams = sortObject(vnpParams)

  const signData = QueryString.stringify(sortedParams, {
    encode: false,
  })

  const hmac = crypto.createHmac('sha512', EnvVars.VNPay.vnp_HashSecret)
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
  sortedParams.vnp_SecureHash = signed
  vnpUrl += '?' + QueryString.stringify(sortedParams, { encode: false })

  return vnpUrl
}
