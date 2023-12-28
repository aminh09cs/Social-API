import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS } from './constant'
import { ErrorStatus } from '~/models/error-status'
import { omit } from 'lodash'

export const errorHandling = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorStatus) {
    return res.status(err.status).json(omit(err, ['status']))
  }

  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err
  })
}
