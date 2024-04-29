import { IReq, IRes } from '@src/types/express/misc'
import { sortObject } from '@src/util/common'
import querystring from 'qs'
import crypto from 'crypto'
import EnvVars from '@src/constants/EnvVars'
import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import moment from 'moment'
import { VNPayMsg } from '@src/constants/VNPayStatusMessage'

type TReqBody = {
  amount: number
  bankCode: string
  orderDescription: string
  orderType: string
  language: string
}

export function checkoutVNPay(req: IReq<TReqBody>, res: IRes) {
  const ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress

  const tmnCode = EnvVars.VNPay.vnp_TmnCode
  const secretKey = EnvVars.VNPay.vnp_HashSecret
  let vnpUrl = EnvVars.VNPay.vnp_Url
  const returnUrl = EnvVars.VNPay.vnp_ReturnUrl

  const date: Date = new Date()

  const createDate: string = moment(date).format('YYYYMMDDHHmmss')
  const orderId: string = moment(date).format('DDHHmmss')
  const expireDate: string = moment(date.setHours(date.getHours() + 1)).format(
    'YYYYMMDDHHmmss',
  )

  const amount = req.body.amount
  const bankCode = req.body.bankCode

  const orderInfo = req.body.orderDescription || ''
  const orderType = req.body.orderType
  const locale = req.body.language || 'vn'
  const currCode = 'VND'
  const vnpParams: Record<string, unknown> = {}

  vnpParams['vnp_Version'] = '2.1.0'
  vnpParams['vnp_Command'] = 'pay'
  vnpParams['vnp_TmnCode'] = tmnCode
  // vnpParams['vnp_Merchant'] = ''
  vnpParams['vnp_Locale'] = locale
  vnpParams['vnp_CurrCode'] = currCode
  vnpParams['vnp_TxnRef'] = orderId
  vnpParams['vnp_OrderInfo'] = orderInfo
  vnpParams['vnp_OrderType'] = orderType
  vnpParams['vnp_Amount'] = amount * 1000000
  vnpParams['vnp_ReturnUrl'] = returnUrl
  vnpParams['vnp_IpAddr'] = ipAddr
  vnpParams['vnp_CreateDate'] = createDate
  vnpParams['vnp_ExpireDate'] = expireDate

  if (bankCode) {
    vnpParams['vnp_BankCode'] = bankCode
  }

  const sortedParams = sortObject(vnpParams)

  const signData: string = querystring.stringify(sortedParams, {
    encode: false,
  })

  const hmac = crypto.createHmac('sha512', secretKey)
  const signed: string = hmac
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex')
  sortedParams.vnp_SecureHash = signed
  vnpUrl += '?' + querystring.stringify(sortedParams, { encode: false })

  return res.status(HttpStatusCodes.OK).json({ url: vnpUrl })
}

export function returnCheckout(req: IReq, res: IRes) {
  let vnp_Params = req.query
  const secureHash = vnp_Params['vnp_SecureHash']

  delete vnp_Params['vnp_SecureHash']
  delete vnp_Params['vnp_SecureHashType']

  const secretKey = EnvVars.VNPay.vnp_HashSecret

  vnp_Params = sortObject(vnp_Params)
  const signData = querystring.stringify(vnp_Params, { encode: false })
  const hmac = crypto.createHmac('sha512', secretKey)
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

  if (secureHash === signed) {
    const orderId = vnp_Params['vnp_TxnRef']
    const rspCode = vnp_Params['vnp_ResponseCode'] as keyof typeof VNPayMsg

    // TODO Handle update to DB the result of payment

    return res
      .status(HttpStatusCodes.OK)
      .json({ RspCode: rspCode, Message: VNPayMsg[rspCode] })
  } else {
    return res
      .status(HttpStatusCodes.OK)
      .json({ RspCode: '97', Message: 'Fail checksum' })
  }
}
