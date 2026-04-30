import { Router } from 'express'
import { register, login, getMe, updateProfile, changePassword, logout } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, getMe)
router.put('/profile', authenticate, updateProfile)
router.put('/change-password', authenticate, changePassword)

export default router
