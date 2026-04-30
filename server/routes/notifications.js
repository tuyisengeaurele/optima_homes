import { Router } from 'express'
import pool from '../config/db.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    )
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
})

router.get('/unread-count', authenticate, async (req, res, next) => {
  try {
    const [[{ count }]] = await pool.execute(
      'SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0',
      [req.user.id]
    )
    res.json({ success: true, data: { count } })
  } catch (err) { next(err) }
})

router.patch('/:id/read', authenticate, async (req, res, next) => {
  try {
    await pool.execute(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    )
    res.json({ success: true })
  } catch (err) { next(err) }
})

router.patch('/mark-all-read', authenticate, async (req, res, next) => {
  try {
    await pool.execute(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
      [req.user.id]
    )
    res.json({ success: true })
  } catch (err) { next(err) }
})

export default router
