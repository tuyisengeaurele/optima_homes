import pool from '../config/db.js'
import Analytics from '../models/Analytics.js'
import { checkDbHealth, getDbStats } from '../config/dbHealth.js'

export const getDashboardStats = async (req, res, next) => {
  try {
    const [[propStats]] = await pool.query(
      `SELECT COUNT(*) as total, SUM(status='available') as active,
        SUM(status='sold') as sold, SUM(status='rented') as rented,
        SUM(views) as total_views
       FROM properties`
    )
    const [[userStats]] = await pool.query(
      `SELECT COUNT(*) as total, SUM(is_active=1) as active,
        SUM(role='admin') as admins
       FROM users`
    )
    const [[inquiryStats]] = await pool.query(
      `SELECT COUNT(*) as total, SUM(status='new') as new_count
       FROM inquiries`
    )

    const [monthlyProperties] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
       FROM properties
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
       GROUP BY month ORDER BY month ASC`
    )

    const [recentProperties] = await pool.query(
      `SELECT p.id, p.title, p.price, p.property_type, p.status, p.city, p.created_at,
        (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
       FROM properties p ORDER BY p.created_at DESC LIMIT 5`
    )

    const [recentInquiries] = await pool.query(
      `SELECT i.*, p.title as property_title
       FROM inquiries i JOIN properties p ON i.property_id = p.id
       ORDER BY i.created_at DESC LIMIT 5`
    )

    res.json({
      success: true,
      data: {
        properties: propStats,
        users: userStats,
        inquiries: inquiryStats,
        monthlyProperties,
        recentProperties,
        recentInquiries,
      }
    })
  } catch (err) {
    next(err)
  }
}

export const trackEvent = async (req, res, next) => {
  try {
    const { property_id, event_type, metadata } = req.body
    const ip = req.ip || req.headers['x-forwarded-for']
    await Analytics.track({
      property_id: property_id || null,
      event_type,
      user_id: req.user?.id || null,
      ip_address: ip,
      user_agent: req.headers['user-agent'],
      metadata,
    })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export const getOverview = async (req, res, next) => {
  try {
    const data = await Analytics.getOverview()
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export const getTopProperties = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50)
    const data = await Analytics.getTopProperties(limit)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export const getDailyViews = async (req, res, next) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 30, 365)
    const data = await Analytics.getDailyViews(days)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export const getCityDistribution = async (req, res, next) => {
  try {
    const data = await Analytics.getCityDistribution()
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

export const getSystemHealth = async (req, res, next) => {
  try {
    const db = await checkDbHealth()
    const tables = await getDbStats()
    res.json({ success: true, data: { db, tables, uptime: process.uptime() } })
  } catch (err) { next(err) }
}
