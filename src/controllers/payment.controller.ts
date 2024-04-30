import { IReq, IRes } from '@src/types/express/misc'
import { sortObject } from '@src/util/common'
import querystring from 'qs'
import crypto from 'crypto'
import EnvVars from '@src/constants/EnvVars'
import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { VNPayMsg } from '@src/constants/VNPayStatusMessage'

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

    // TODO Handle update to Booking DB the result of payment

    return res
      .status(HttpStatusCodes.OK)
      .json({ RspCode: rspCode, Message: VNPayMsg[rspCode] })
  } else {
    return res
      .status(HttpStatusCodes.OK)
      .json({ RspCode: '97', Message: 'Fail checksum' })
  }
}
