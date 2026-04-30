import pool from '../config/db.js'
import bcrypt from 'bcryptjs'

export const User = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    return rows[0] || null
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, avatar, phone, location, bio, is_active, created_at FROM users WHERE id = ?',
      [id]
    )
    return rows[0] || null
  },

  async create({ name, email, password, role = 'user' }) {
    const hashed = await bcrypt.hash(password, 12)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, role]
    )
    return result.insertId
  },

  async comparePassword(plain, hashed) {
    return bcrypt.compare(plain, hashed)
  },

  async update(id, fields) {
    const allowed = ['name', 'phone', 'location', 'bio', 'avatar']
    const updates = Object.keys(fields)
      .filter(k => allowed.includes(k))
      .map(k => `${k} = ?`)
    if (!updates.length) return false
    const values = Object.keys(fields).filter(k => allowed.includes(k)).map(k => fields[k])
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, [...values, id])
    return true
  },

  async changePassword(id, newPassword) {
    const hashed = await bcrypt.hash(newPassword, 12)
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, id])
  },

  async getAll({ page = 1, limit = 20 }) {
    const offset = (page - 1) * limit
    const [rows] = await pool.query(
      'SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    )
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM users')
    return { users: rows, total, page, pages: Math.ceil(total / limit) }
  },

  async toggleActive(id) {
    await pool.query('UPDATE users SET is_active = NOT is_active WHERE id = ?', [id])
  },

  async delete(id) {
    await pool.query('DELETE FROM users WHERE id = ?', [id])
  },
}
