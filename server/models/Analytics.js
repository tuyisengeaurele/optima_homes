import pool from '../config/db.js'

export default class Analytics {
  static async track(data) {
    const { property_id, event_type, user_id, ip_address, user_agent, metadata } = data
    const [result] = await pool.execute(
      `INSERT INTO analytics (property_id, event_type, user_id, ip_address, user_agent, metadata)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [property_id || null, event_type, user_id || null, ip_address || null, user_agent || null, JSON.stringify(metadata || {})]
    )
    return result.insertId
  }

  static async getOverview() {
    const [[counts]] = await pool.execute(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_users,
        (SELECT COUNT(*) FROM properties) AS total_properties,
        (SELECT COUNT(*) FROM inquiries) AS total_inquiries,
        (SELECT COUNT(*) FROM favorites) AS total_favorites,
        (SELECT SUM(views) FROM properties) AS total_views
    `)
    return counts
  }

  static async getTopProperties(limit = 10) {
    const [rows] = await pool.execute(
      `SELECT p.id, p.title, p.city, p.views,
              COUNT(DISTINCT f.id) AS favorites,
              COUNT(DISTINCT i.id) AS inquiries
       FROM properties p
       LEFT JOIN favorites f ON f.property_id = p.id
       LEFT JOIN inquiries i ON i.property_id = p.id
       GROUP BY p.id
       ORDER BY p.views DESC
       LIMIT ?`,
      [limit]
    )
    return rows
  }

  static async getDailyViews(days = 30) {
    const [rows] = await pool.execute(
      `SELECT DATE(created_at) AS date, COUNT(*) AS count
       FROM analytics
       WHERE event_type = 'view' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [days]
    )
    return rows
  }

  static async getPropertyEventCounts(propertyId) {
    const [rows] = await pool.execute(
      `SELECT event_type, COUNT(*) AS count
       FROM analytics
       WHERE property_id = ?
       GROUP BY event_type`,
      [propertyId]
    )
    return rows
  }

  static async getCityDistribution() {
    const [rows] = await pool.execute(`
      SELECT city, COUNT(*) AS count, AVG(price) AS avg_price
      FROM properties
      WHERE status = 'available'
      GROUP BY city
      ORDER BY count DESC
    `)
    return rows
  }
}
