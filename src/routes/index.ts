import { Router } from 'express'
import auth from './authentication.router'
import user from './user.router'

const routes = Router()

routes.use('/auth', auth)
routes.use('/user', user)

export default routes
