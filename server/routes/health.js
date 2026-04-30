import { Router } from 'express'
import { checkDbHealth } from '../config/dbHealth.js'

const router = Router()

router.get('/', async (req, res) => {
  const db = await checkDbHealth()
  res.json({
    status: db.healthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    services: { database: db.healthy ? 'up' : 'down' },
  })
})

export default router
