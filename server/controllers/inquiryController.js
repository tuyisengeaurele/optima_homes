import pool from '../config/db.js'

export const createInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body
    const { propertyId } = req.params

    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' })

    const [result] = await pool.query(
      'INSERT INTO inquiries (property_id, user_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?, ?)',
      [propertyId, req.user?.id || null, name, email, phone || null, message]
    )

    res.status(201).json({ success: true, message: 'Inquiry sent successfully! We will contact you soon.' })
  } catch (err) {
    next(err)
  }
}

export const getMyInquiries = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT i.*, p.title as property_title, p.city,
        (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = 1 LIMIT 1) as property_image
       FROM inquiries i
       JOIN properties p ON i.property_id = p.id
       WHERE i.user_id = ?
       ORDER BY i.created_at DESC`,
      [req.user.id]
    )
    res.json({ success: true, data: { inquiries: rows } })
  } catch (err) {
    next(err)
  }
}

export const getAllInquiries = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query
    const offset = (page - 1) * limit
    let where = ''
    const params = []
    if (status) { where = 'WHERE i.status = ?'; params.push(status) }

    const [rows] = await pool.query(
      `SELECT i.*, p.title as property_title, p.city
       FROM inquiries i
       JOIN properties p ON i.property_id = p.id
       ${where}
       ORDER BY i.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    )
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM inquiries i ${where}`, params)
    res.json({ success: true, data: { inquiries: rows, total, page: Number(page), pages: Math.ceil(total / limit) } })
  } catch (err) {
    next(err)
  }
}

export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const valid = ['new', 'read', 'replied', 'closed']
    if (!valid.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' })

    await pool.query('UPDATE inquiries SET status = ? WHERE id = ?', [status, req.params.id])
    res.json({ success: true, message: 'Inquiry status updated' })
  } catch (err) {
    next(err)
  }
}

export const getInquiryStats = async (req, res, next) => {
  try {
    const [[stats]] = await pool.query(
      `SELECT
        COUNT(*) as total,
        SUM(status = 'new') as new_count,
        SUM(status = 'read') as read_count,
        SUM(status = 'replied') as replied_count,
        SUM(status = 'closed') as closed_count
       FROM inquiries`
    )
    res.json({ success: true, data: { stats } })
  } catch (err) {
    next(err)
  }
}
