import { Router } from 'express'
import { getDashboardStats, trackEvent } from '../controllers/analyticsController.js'
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js'

const router = Router()

router.get('/dashboard', authenticate, requireAdmin, getDashboardStats)
router.post('/track', optionalAuth, trackEvent)

export default router
