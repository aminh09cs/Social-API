import { Request, Response, NextFunction } from 'express'
import { pick } from 'lodash'

export const filterKeys =
  <T>(keys: (keyof T)[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, keys)
    next()
  }
