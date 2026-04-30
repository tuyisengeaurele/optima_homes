import { Router } from 'express'
import {
  getProperties, getProperty, getFeatured,
  createProperty, updateProperty, deleteProperty,
  deletePropertyImage, getPropertyStats
} from '../controllers/propertyController.js'
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js'
import { uploadImages } from '../middleware/upload.js'

const router = Router()

router.get('/', getProperties)
router.get('/featured', getFeatured)
router.get('/stats', authenticate, requireAdmin, getPropertyStats)
router.get('/:id', optionalAuth, getProperty)
router.post('/', authenticate, requireAdmin, uploadImages, createProperty)
router.put('/:id', authenticate, requireAdmin, uploadImages, updateProperty)
router.delete('/:id', authenticate, requireAdmin, deleteProperty)
router.delete('/:id/images/:imageId', authenticate, requireAdmin, deletePropertyImage)

export default router
