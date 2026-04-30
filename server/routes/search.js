import { Router } from 'express'
import pool from '../config/db.js'

const router = Router()

// GET /api/search/autocomplete?q=kigali
router.get('/autocomplete', async (req, res) => {
  const { q = '' } = req.query
  if (q.trim().length < 2) return res.json([])

  const term = `%${q.trim()}%`
  const [rows] = await pool.execute(
    `SELECT id, title, city, price, listing_type,
            (SELECT image_url FROM property_images WHERE property_id = properties.id AND is_primary = 1 LIMIT 1) AS image
     FROM properties
     WHERE status = 'available' AND (title LIKE ? OR city LIKE ? OR address LIKE ?)
     LIMIT 8`,
    [term, term, term]
  )
  res.json(rows)
})

// GET /api/search/suggestions — popular cities and categories
router.get('/suggestions', async (req, res) => {
  const [cities] = await pool.execute(
    `SELECT city, COUNT(*) AS count FROM properties WHERE status = 'available' GROUP BY city ORDER BY count DESC LIMIT 6`
  )
  const [types] = await pool.execute(
    `SELECT property_type, COUNT(*) AS count FROM properties WHERE status = 'available' GROUP BY property_type ORDER BY count DESC`
  )
  res.json({ cities, types })
})

// GET /api/search/recent — recently added properties
router.get('/recent', async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT id, title, city, price, listing_type, property_type,
            (SELECT image_url FROM property_images WHERE property_id = properties.id AND is_primary = 1 LIMIT 1) AS image
     FROM properties WHERE status = 'available'
     ORDER BY created_at DESC LIMIT 6`
  )
  res.json(rows)
})

export default router
