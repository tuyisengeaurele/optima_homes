import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

import { testConnection } from './config/db.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

import authRoutes from './routes/auth.js'
import propertyRoutes from './routes/properties.js'
import favoriteRoutes from './routes/favorites.js'
import inquiryRoutes from './routes/inquiries.js'
import userRoutes from './routes/users.js'
import analyticsRoutes from './routes/analytics.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true }))

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'))

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'OptimaHomes API', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/users', userRoutes)
app.use('/api/analytics', analyticsRoutes)

// Error handling
app.use(notFound)
app.use(errorHandler)

// Start
const start = async () => {
  await testConnection()
  app.listen(PORT, () => {
    console.log(`🚀 OptimaHomes API running on http://localhost:${PORT}`)
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
  })
}

start()

export default app
