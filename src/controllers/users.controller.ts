import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LoginRequestBody, RegisterRequestBody } from '~/models/requests/user.request'
import userService from '~/services/user.service'

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userService.register(req.body)
  console.log(req.body)
  return res.json({
    message: 'Register Successfully',
    result
  })
}

export const loginController = async (
  req: Request<ParamsDictionary, any, LoginRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req
  console.log()
  const result = await userService.login({ user_id: '1', verify: 2 })
  res.json({ message: 'Done1' })
}
