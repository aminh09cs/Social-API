import { Router } from 'express'
import { registerController } from '~/controllers/users.controller'
import { registerValidator, loginValidator } from '~/middlewares/users.middleware'
import { requestHandler } from '~/utils/support'

const usersRouter: Router = Router()

usersRouter.post('/register', registerValidator, requestHandler(registerController))
usersRouter.post('/login', loginValidator, (req, res) => {
  res.json({ message: 'Done' })
})

export default usersRouter
