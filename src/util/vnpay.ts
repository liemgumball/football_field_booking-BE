import EnvVars from '@src/constants/EnvVars'
import { IReq } from '@src/types/express/misc'
import moment from 'moment'
import { sortObject } from './common'
import QueryString from 'qs'
import crypto from 'crypto'

export function getCheckoutUrl(
  req: IReq,
  bookingId: string,
  amount: number,
  orderDescription?: string | null,
  bankCode?: string,
) {
  const ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress

  let vnpUrl = EnvVars.VNPay.vnp_Url

  const date: Date = new Date()

  const createDate: string = moment(date).format('YYYYMMDDHHmmss')
  const orderId: string = moment(date).format('DDHHmmss')

  // Send the bookingId as an info to update the booking data after checkout
  const bookingInfo = `${bookingId},${orderDescription}`

  const orderInfo = JSON.stringify(bookingInfo)
  const orderType = '160000'
  const locale = 'vn'
  const currCode = 'VND'
  const vnpParams: Record<string, unknown> = {}

  vnpParams['vnp_Version'] = '2.1.0'
  vnpParams['vnp_Command'] = 'pay'
  vnpParams['vnp_TmnCode'] = EnvVars.VNPay.vnp_TmnCode
  // vnpParams['vnp_Merchant'] = ''
  vnpParams['vnp_Locale'] = locale
  vnpParams['vnp_CurrCode'] = currCode
  vnpParams['vnp_TxnRef'] = orderId
  vnpParams['vnp_OrderInfo'] = orderInfo
  vnpParams['vnp_OrderType'] = orderType
  vnpParams['vnp_Amount'] = amount * 100 * 1000
  vnpParams['vnp_ReturnUrl'] = EnvVars.VNPay.vnp_ReturnUrl
  vnpParams['vnp_IpAddr'] = ipAddr
  vnpParams['vnp_CreateDate'] = createDate

  if (bankCode) {
    vnpParams['vnp_BankCode'] = bankCode
  }

  const sortedParams = sortObject(vnpParams)

  const signData: string = QueryString.stringify(sortedParams, {
    encode: false,
  })

  const hmac = crypto.createHmac('sha512', EnvVars.VNPay.vnp_HashSecret)
  const signed: string = hmac
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex')
  sortedParams.vnp_SecureHash = signed
  vnpUrl += '?' + QueryString.stringify(sortedParams, { encode: false })

  return vnpUrl
}

export function parseOrderInfo(orderInfo: string) {
  const decoded = decodeURIComponent(orderInfo)

  const info = decoded.substring(1, decoded.length - 1)

  return info.split(',').map((i) => i)
}
