import { Router } from 'express'
import { accessTokenValidator, verifyEmailValidator, updateMeValidator } from '~/middlewares/users.middleware'
import { meController, updateMeController, profileController } from '~/controllers/users.controller'
import { UpdateMeRequestBody } from '~/models/requests/user.request'
import { filterKeys } from '~/middlewares/filter.middleware'
import { requestHandler } from '~/utils/support'

const usersRouter: Router = Router()

usersRouter.get('/me', accessTokenValidator, requestHandler(meController))
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifyEmailValidator,
  updateMeValidator,
  filterKeys<UpdateMeRequestBody>(['name', 'date_of_birth', 'bio', 'location', 'username', 'avatar']),
  updateMeController
)
usersRouter.get('/:username', requestHandler(profileController as any))
export default usersRouter
