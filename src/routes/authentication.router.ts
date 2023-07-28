import { Router } from 'express'
const router = Router()

//controllers
import { register, login } from '../controllers/authentication.controller'
//validation middleware
import {
  registerValidation,
  loginValidation,
} from '../middleware/validation.middleware'

router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)

export default router
