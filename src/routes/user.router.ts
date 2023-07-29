import { Router } from 'express'
const router = Router()

//controllers
import { getUsers, getUser } from '../controllers/user.controller'
//validation middleware
router.get('', getUsers)
router.get('/:id', getUser)

export default router
