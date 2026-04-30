import pool from '../config/db.js'

export const getFavorites = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*,
        (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) as primary_image,
        f.created_at as saved_at
       FROM favorites f
       JOIN properties p ON f.property_id = p.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [req.user.id]
    )
    res.json({ success: true, data: { favorites: rows } })
  } catch (err) {
    next(err)
  }
}

export const addFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params
    await pool.query(
      'INSERT IGNORE INTO favorites (user_id, property_id) VALUES (?, ?)',
      [req.user.id, propertyId]
    )
    res.json({ success: true, message: 'Property saved to favorites' })
  } catch (err) {
    next(err)
  }
}

export const removeFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params
    await pool.query(
      'DELETE FROM favorites WHERE user_id = ? AND property_id = ?',
      [req.user.id, propertyId]
    )
    res.json({ success: true, message: 'Property removed from favorites' })
  } catch (err) {
    next(err)
  }
}

export const checkFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params
    const [[row]] = await pool.query(
      'SELECT id FROM favorites WHERE user_id = ? AND property_id = ?',
      [req.user.id, propertyId]
    )
    res.json({ success: true, data: { isFavorite: !!row } })
  } catch (err) {
    next(err)
  }
}
