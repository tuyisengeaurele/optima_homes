import { Router } from 'express'
import { getAllUsers, getUser, toggleUserStatus, deleteUser } from '../controllers/userController.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.use(authenticate, requireAdmin)
router.get('/', getAllUsers)
router.get('/:id', getUser)
router.put('/:id/toggle', toggleUserStatus)
router.delete('/:id', deleteUser)

export default router
