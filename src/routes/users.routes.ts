import { Router } from 'express'
import { registerValidator } from '~/middlewares/users.middleware'

const usersRouter: Router = Router()

usersRouter.post('/register', registerValidator, (req, res) => {
  return res.json({
    message: 'Login Successfully'
  })
})

export default usersRouter
