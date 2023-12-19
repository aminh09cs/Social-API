import { Router } from 'express'
import usersRouter from './users.routes'

const router: Router = Router()

router.use('/auth', usersRouter)

export const MainRouter: Router = router
