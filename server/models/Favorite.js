import pool from '../config/db.js'

export default class Favorite {
  static async toggle(userId, propertyId) {
    const [[existing]] = await pool.execute(
      'SELECT id FROM favorites WHERE user_id = ? AND property_id = ?',
      [userId, propertyId]
    )

    if (existing) {
      await pool.execute('DELETE FROM favorites WHERE id = ?', [existing.id])
      return { favorited: false }
    }

    await pool.execute(
      'INSERT INTO favorites (user_id, property_id) VALUES (?, ?)',
      [userId, propertyId]
    )
    return { favorited: true }
  }

  static async getByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT p.*,
              (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) AS primary_image,
              f.created_at AS favorited_at
       FROM favorites f
       JOIN properties p ON p.id = f.property_id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    )
    return rows
  }

  static async isFavorited(userId, propertyId) {
    const [[row]] = await pool.execute(
      'SELECT id FROM favorites WHERE user_id = ? AND property_id = ?',
      [userId, propertyId]
    )
    return !!row
  }

  static async getCountForProperty(propertyId) {
    const [[{ count }]] = await pool.execute(
      'SELECT COUNT(*) AS count FROM favorites WHERE property_id = ?',
      [propertyId]
    )
    return count
  }
}
