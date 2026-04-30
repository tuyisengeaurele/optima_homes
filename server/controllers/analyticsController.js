import pool from '../config/db.js'

export const getDashboardStats = async (req, res, next) => {
  try {
    const [[propStats]] = await pool.query(
      `SELECT COUNT(*) as total, SUM(status='active') as active,
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
      `SELECT p.id, p.title, p.price, p.type, p.status, p.city, p.created_at,
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
    const { event_type, entity_id, metadata } = req.body
    const ip = req.ip || req.headers['x-forwarded-for']
    await pool.query(
      'INSERT INTO analytics (event_type, entity_id, user_id, ip_address, metadata) VALUES (?, ?, ?, ?, ?)',
      [event_type, entity_id || null, req.user?.id || null, ip, metadata ? JSON.stringify(metadata) : null]
    )
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}
