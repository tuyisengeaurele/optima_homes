import { Router } from 'express'
import { getFavorites, addFavorite, removeFavorite, checkFavorite } from '../controllers/favoriteController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.use(authenticate)
router.get('/', getFavorites)
router.get('/check/:propertyId', checkFavorite)
router.post('/:propertyId', addFavorite)
router.delete('/:propertyId', removeFavorite)

export default router
