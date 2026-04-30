import pool from '../config/db.js'

export const Property = {
  async getAll(filters = {}, page = 1, limit = 12) {
    const offset = (page - 1) * limit
    let where = ['p.status = "active"']
    const params = []

    if (filters.type) { where.push('p.type = ?'); params.push(filters.type) }
    if (filters.property_type) { where.push('p.property_type = ?'); params.push(filters.property_type) }
    if (filters.city) { where.push('p.city LIKE ?'); params.push(`%${filters.city}%`) }
    if (filters.bedrooms) { where.push('p.bedrooms >= ?'); params.push(Number(filters.bedrooms)) }
    if (filters.bathrooms) { where.push('p.bathrooms >= ?'); params.push(Number(filters.bathrooms)) }
    if (filters.min_price) { where.push('p.price >= ?'); params.push(Number(filters.min_price)) }
    if (filters.max_price) { where.push('p.price <= ?'); params.push(Number(filters.max_price)) }
    if (filters.featured) { where.push('p.featured = 1') }
    if (filters.search) {
      where.push('MATCH(p.title, p.description, p.address, p.city) AGAINST(? IN BOOLEAN MODE)')
      params.push(`${filters.search}*`)
    }

    const sortMap = {
      newest: 'p.created_at DESC',
      oldest: 'p.created_at ASC',
      price_asc: 'p.price ASC',
      price_desc: 'p.price DESC',
      views: 'p.views DESC',
    }
    const orderBy = sortMap[filters.sort] || 'p.created_at DESC'
    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''

    const [rows] = await pool.query(
      `SELECT p.*,
        (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) as primary_image,
        (SELECT COUNT(*) FROM property_images WHERE property_id = p.id) as image_count
       FROM properties p
       ${whereClause}
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM properties p ${whereClause}`,
      params
    )

    return { properties: rows, total, page, pages: Math.ceil(total / limit), limit }
  },

  async getById(id) {
    const [[property]] = await pool.query(
      `SELECT p.*, u.name as admin_name
       FROM properties p
       LEFT JOIN users u ON p.admin_id = u.id
       WHERE p.id = ?`,
      [id]
    )
    if (!property) return null

    const [images] = await pool.query(
      'SELECT * FROM property_images WHERE property_id = ? ORDER BY is_primary DESC, sort_order ASC',
      [id]
    )
    await pool.query('UPDATE properties SET views = views + 1 WHERE id = ?', [id])
    return { ...property, images }
  },

  async create(data) {
    const {
      title, description, price, type, status = 'active', property_type,
      bedrooms, bathrooms, area, garage, floors, year_built,
      address, city, state, country, latitude, longitude,
      featured = false, amenities, admin_id
    } = data

    const [result] = await pool.query(
      `INSERT INTO properties
       (title, description, price, type, status, property_type, bedrooms, bathrooms, area, garage, floors, year_built, address, city, state, country, latitude, longitude, featured, amenities, admin_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, price, type, status, property_type, bedrooms, bathrooms, area, garage, floors, year_built,
       address, city, state, country, latitude, longitude, featured ? 1 : 0,
       amenities ? JSON.stringify(amenities) : null, admin_id]
    )
    return result.insertId
  },

  async update(id, data) {
    const allowed = ['title', 'description', 'price', 'type', 'status', 'property_type',
      'bedrooms', 'bathrooms', 'area', 'garage', 'floors', 'year_built',
      'address', 'city', 'state', 'country', 'latitude', 'longitude', 'featured', 'amenities']
    const updates = Object.keys(data).filter(k => allowed.includes(k)).map(k => `${k} = ?`)
    if (!updates.length) return false
    const values = Object.keys(data).filter(k => allowed.includes(k)).map(k =>
      k === 'amenities' ? JSON.stringify(data[k]) : data[k]
    )
    await pool.query(`UPDATE properties SET ${updates.join(', ')} WHERE id = ?`, [...values, id])
    return true
  },

  async delete(id) {
    await pool.query('DELETE FROM properties WHERE id = ?', [id])
  },

  async addImages(propertyId, images) {
    const values = images.map((img, i) => [propertyId, img.url, i === 0, i])
    await pool.query(
      'INSERT INTO property_images (property_id, image_url, is_primary, sort_order) VALUES ?',
      [values]
    )
  },

  async deleteImage(imageId) {
    await pool.query('DELETE FROM property_images WHERE id = ?', [imageId])
  },

  async getFeatured(limit = 6) {
    const [rows] = await pool.query(
      `SELECT p.*,
        (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
       FROM properties p
       WHERE p.featured = 1 AND p.status = 'active'
       ORDER BY p.created_at DESC
       LIMIT ?`,
      [limit]
    )
    return rows
  },

  async getStats() {
    const [[stats]] = await pool.query(
      `SELECT
        COUNT(*) as total,
        SUM(status = 'active') as active,
        SUM(status = 'sold') as sold,
        SUM(status = 'rented') as rented,
        SUM(type = 'sale') as for_sale,
        SUM(type = 'rent') as for_rent,
        SUM(featured = 1) as featured,
        SUM(views) as total_views
       FROM properties`
    )
    return stats
  },

  async getSimilar(id, type, city, limit = 4) {
    const [rows] = await pool.query(
      `SELECT p.*,
        (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
       FROM properties p
       WHERE p.id != ? AND p.type = ? AND p.city = ? AND p.status = 'active'
       ORDER BY p.created_at DESC
       LIMIT ?`,
      [id, type, city, limit]
    )
    return rows
  },
}
