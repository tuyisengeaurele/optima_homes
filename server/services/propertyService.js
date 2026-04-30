import pool from '../config/db.js'
import { Property } from '../models/Property.js'

export const getPropertyWithFullData = async (id) => {
  const property = await Property.getById(id)
  if (!property) return null

  const [images] = await pool.query(
    'SELECT * FROM property_images WHERE property_id = ? ORDER BY is_primary DESC, sort_order ASC',
    [id]
  )

  const amenities = property.amenities
    ? (typeof property.amenities === 'string' ? JSON.parse(property.amenities) : property.amenities)
    : []

  return { ...property, images, amenities }
}

export const searchProperties = async (query, limit = 10) => {
  const [rows] = await pool.query(
    `SELECT p.id, p.title, p.price, p.type, p.city,
      (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
     FROM properties p
     WHERE p.status = 'active' AND
       MATCH(p.title, p.description, p.address, p.city) AGAINST(? IN BOOLEAN MODE)
     LIMIT ?`,
    [`${query}*`, limit]
  )
  return rows
}

export const toggleFeatured = async (id) => {
  await pool.query('UPDATE properties SET featured = NOT featured WHERE id = ?', [id])
  const [[{ featured }]] = await pool.query('SELECT featured FROM properties WHERE id = ?', [id])
  return featured
}

export const updatePropertyStatus = async (id, status) => {
  const validStatuses = ['active', 'sold', 'rented', 'pending', 'inactive']
  if (!validStatuses.includes(status)) throw new Error('Invalid status')
  await pool.query('UPDATE properties SET status = ? WHERE id = ?', [status, id])
}

export const getPropertyStatsByCity = async () => {
  const [rows] = await pool.query(
    `SELECT city, COUNT(*) as count, AVG(price) as avg_price,
      SUM(type = 'sale') as for_sale, SUM(type = 'rent') as for_rent
     FROM properties WHERE status = 'active'
     GROUP BY city ORDER BY count DESC LIMIT 10`
  )
  return rows
}
