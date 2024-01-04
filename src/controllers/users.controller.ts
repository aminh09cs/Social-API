import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  ChangePasswordRequestBody,
  EmailVerifyRequestBody,
  ForgotPasswordRequestBody,
  LoginRequestBody,
  ProfileParams,
  RegisterRequestBody,
  ResetPasswordRequestBody,
  UpdateMeRequestBody,
  VerifyForgotPasswordRequestBody
} from '~/models/requests/user.request'
import userService from '~/services/user.service'
import { HTTP_STATUS, MESSAGES, UserVerifyStatusType } from '~/utils/constant'
import databaseService from '~/services/database.service'
import { ErrorStatus } from '~/models/error-status'
import User from '~/models/schemas/user.schema'

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userService.register(req.body)
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
  const { user } = req

  const _id = user?._id as ObjectId
  const verify = user?.verify as UserVerifyStatusType

  const result = await userService.login({ user_id: _id.toString(), verify: verify })
  return res.json({
    message: 'Login Successfully',
    result
  })
}
export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  const { refresh_token } = req
  const token = refresh_token?.token as string
  await userService.logout({ token })

  return res.json({
    message: 'Logout Successfully'
  })
}
export const verifyEmailTokenController = async (
  req: Request<ParamsDictionary, any, EmailVerifyRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    throw new ErrorStatus({
      message: MESSAGES.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatusType.Verified) {
    throw new ErrorStatus({
      message: MESSAGES.EMAIL_IS_VERIFIED_BEFORE,
      status: HTTP_STATUS.NOT_FOUND
    })
  }

  await userService.verifyEmail({ user_id })
  return res.json({
    message: 'Verify Email Successfully'
  })
}

export const resendEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    throw new ErrorStatus({
      message: MESSAGES.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatusType.Verified) {
    throw new ErrorStatus({
      message: MESSAGES.EMAIL_IS_VERIFIED_BEFORE,
      status: HTTP_STATUS.NOT_FOUND
    })
  }

  await userService.resendEmail({ user_id })
  return res.json({
    message: 'Resend Email Successfully'
  })
}
export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user
  await userService.forgotPassword(user as User)
  return res.json({
    message: 'Check email to reset password'
  })
}
export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  return res.json({
    message: 'Verify forgot password successfully'
  })
}
export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_forgot_password_token
  const { password } = req.body
  await userService.resetPassword({ user_id, password })
  return res.json({
    message: 'Reset password successfully'
  })
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization
  const { new_password } = req.body
  await userService.changePassword({ user_id, new_password })

  return res.json({
    message: 'Change password successfully'
  })
}
export const meController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization
  const result = await userService.getMe({ user_id })
  return res.json(result)
}
export const updateMeController = async (
  req: Request<ParamsDictionary, any, UpdateMeRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization
  const payload = req.body as UpdateMeRequestBody
  const result = await userService.updateMe({ user_id, payload })
  return res.json({
    message: 'Update profile successfully',
    result
  })
}
export const profileController = async (req: Request<ProfileParams>, res: Response, next: NextFunction) => {
  const { username } = req.params
  const result = await userService.getProfile({ username })
  return res.json(result)
}
