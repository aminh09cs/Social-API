import { Router } from 'express'
import {
  registerController,
  loginController,
  logoutController,
  verifyEmailTokenController,
  resendEmailController,
  forgotPasswordController,
  verifyForgotPasswordController
} from '~/controllers/users.controller'
import {
  registerValidator,
  loginValidator,
  accessTokenValidator,
  refreshTokenValidator,
  verifyEmailTokenValidator,
  forgotPasswordValidator,
  verifyForgotPasswordValidator
} from '~/middlewares/users.middleware'
import { requestHandler } from '~/utils/support'

const usersRouter: Router = Router()

usersRouter.post('/register', registerValidator, requestHandler(registerController))
usersRouter.post('/login', loginValidator, requestHandler(loginController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, requestHandler(logoutController))
usersRouter.post('/verify-email', verifyEmailTokenValidator, requestHandler(verifyEmailTokenController))
usersRouter.post('/resend-email', accessTokenValidator, requestHandler(resendEmailController))
usersRouter.post('/forgot-password', forgotPasswordValidator, requestHandler(forgotPasswordController))
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordValidator,
  requestHandler(verifyForgotPasswordController)
)

export default usersRouter
