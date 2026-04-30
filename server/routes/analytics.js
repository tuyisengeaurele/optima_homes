import { Router } from 'express'
import {
  getDashboardStats, trackEvent,
  getOverview, getTopProperties, getDailyViews,
  getCityDistribution, getSystemHealth,
} from '../controllers/analyticsController.js'
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js'

const router = Router()

router.get('/dashboard', authenticate, requireAdmin, getDashboardStats)
router.get('/overview', authenticate, requireAdmin, getOverview)
router.get('/top-properties', authenticate, requireAdmin, getTopProperties)
router.get('/daily-views', authenticate, requireAdmin, getDailyViews)
router.get('/cities', authenticate, requireAdmin, getCityDistribution)
router.get('/health', authenticate, requireAdmin, getSystemHealth)
router.post('/track', optionalAuth, trackEvent)

export default router
