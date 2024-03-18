import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { IReq, IRes } from '@src/types/express/misc'
import { NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'

const validateResource =
  <T>(schema: AnyZodObject) =>
  (req: IReq<T>, res: IRes, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      next()
      // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    } catch (e: unknown | ZodError) {
      if (e instanceof ZodError) {
        // If it's a ZodError, return the error details
        return res.status(HttpStatusCodes.BAD_REQUEST).send(e.errors)
      } else {
        // If it's another type of error, handle it accordingly
        return res
          .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
          .send('Internal Server Error')
      }
    }
  }

export default validateResource
