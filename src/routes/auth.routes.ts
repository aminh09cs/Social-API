import { Router } from 'express'
import {
  registerController,
  loginController,
  logoutController,
  verifyEmailTokenController,
  resendEmailController,
  forgotPasswordController,
  verifyForgotPasswordController,
  resetPasswordController,
  changePasswordController
} from '~/controllers/users.controller'
import {
  registerValidator,
  loginValidator,
  accessTokenValidator,
  refreshTokenValidator,
  verifyEmailTokenValidator,
  forgotPasswordValidator,
  verifyForgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
  changePasswordValidator
} from '~/middlewares/users.middleware'
import { filterKeys } from '~/middlewares/filter.middleware'
import { EmailVerifyRequestBody, RegisterRequestBody } from '~/models/requests/user.request'
import { requestHandler } from '~/utils/support'

const authRouter: Router = Router()

authRouter.post(
  '/register',
  registerValidator,
  filterKeys<RegisterRequestBody>(['name', 'email', 'password', 'confirm_password', 'date_of_birth']),
  requestHandler(registerController)
)
authRouter.post('/login', loginValidator, requestHandler(loginController))
authRouter.post('/logout', accessTokenValidator, refreshTokenValidator, requestHandler(logoutController))
authRouter.post(
  '/verify-email',
  verifyEmailTokenValidator,
  filterKeys<EmailVerifyRequestBody>(['email_verify_token']),
  requestHandler(verifyEmailTokenController)
)
authRouter.post('/resend-email', accessTokenValidator, requestHandler(resendEmailController))
authRouter.post('/forgot-password', forgotPasswordValidator, requestHandler(forgotPasswordController))
authRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordValidator,
  requestHandler(verifyForgotPasswordController)
)
authRouter.post('/reset-password', resetPasswordValidator, requestHandler(resetPasswordController))
authRouter.put(
  '/change-password',
  accessTokenValidator,
  verifyEmailValidator,
  changePasswordValidator,
  requestHandler(changePasswordController)
)

export default authRouter
