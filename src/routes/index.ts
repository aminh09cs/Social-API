import { Router } from 'express'
import authRouter from './auth.routes'
import usersRouter from './users.routes'

const router: Router = Router()

router.use('/auth', authRouter)
router.use('/user', usersRouter)

export const MainRouter: Router = router
