import pool from '../config/db.js'

export default class Inquiry {
  static async create(data) {
    const { property_id, user_id, name, email, phone, message } = data
    const [result] = await pool.execute(
      `INSERT INTO inquiries (property_id, user_id, name, email, phone, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [property_id, user_id || null, name, email, phone || null, message]
    )
    return result.insertId
  }

  static async getAll({ page = 1, limit = 20, status, property_id } = {}) {
    const offset = (page - 1) * limit
    const conditions = []
    const params = []

    if (status) { conditions.push('i.status = ?'); params.push(status) }
    if (property_id) { conditions.push('i.property_id = ?'); params.push(property_id) }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const [rows] = await pool.execute(
      `SELECT i.*, p.title AS property_title, p.city AS property_city
       FROM inquiries i
       LEFT JOIN properties p ON p.id = i.property_id
       ${where}
       ORDER BY i.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )

    const [[{ total }]] = await pool.execute(
      `SELECT COUNT(*) AS total FROM inquiries i ${where}`,
      params
    )

    return { rows, total, page, limit, pages: Math.ceil(total / limit) }
  }

  static async getByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT i.*, p.title AS property_title, p.city AS property_city,
              (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) AS property_image
       FROM inquiries i
       LEFT JOIN properties p ON p.id = i.property_id
       WHERE i.user_id = ?
       ORDER BY i.created_at DESC`,
      [userId]
    )
    return rows
  }

  static async updateStatus(id, status) {
    await pool.execute('UPDATE inquiries SET status = ? WHERE id = ?', [status, id])
  }

  static async delete(id) {
    await pool.execute('DELETE FROM inquiries WHERE id = ?', [id])
  }
}
