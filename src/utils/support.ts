import { ValidationChain, validationResult } from 'express-validator'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { ErrorStatus, UnprocessableEntityErrorStatus } from '~/models/error-status'

export const validate = (schema: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await schema.run(req)
    const errors = validationResult(req)
    const errorsMapped = errors.mapped()
    console.log(errors)
    if (errors.isEmpty()) {
      return next()
    }

    //config all errors relaved with errors validation by 422 error
    const uEntityError = new UnprocessableEntityErrorStatus({ errors: {} })
    for (const key in errorsMapped) {
      const { msg } = errorsMapped[key]
      if (msg instanceof ErrorStatus) {
        return next(msg)
      }
      uEntityError.errors[key] = errorsMapped[key]
    }
    return next(uEntityError)
  }
}

export const requestHandler = <P>(func: RequestHandler<P>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}
