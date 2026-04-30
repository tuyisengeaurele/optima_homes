import { Router } from 'express'
import {
  createInquiry, getMyInquiries, getAllInquiries,
  updateInquiryStatus, getInquiryStats
} from '../controllers/inquiryController.js'
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js'

const router = Router()

router.post('/property/:propertyId', optionalAuth, createInquiry)
router.get('/my', authenticate, getMyInquiries)
router.get('/', authenticate, requireAdmin, getAllInquiries)
router.get('/stats', authenticate, requireAdmin, getInquiryStats)
router.put('/:id/status', authenticate, requireAdmin, updateInquiryStatus)

export default router
