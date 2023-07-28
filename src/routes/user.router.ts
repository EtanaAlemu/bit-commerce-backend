import { Router } from 'express'
const router = Router()

//controllers
import { getUsers, getUser } from '../controllers/user.controller'
//validation middleware
import { registerValidation } from '../middleware/validation.middleware'

router.get('/', registerValidation, getUsers)
router.get('/:id', getUser)

export default router
