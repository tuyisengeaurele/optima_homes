import { User } from '../models/User.js'
import { generateToken, generateRefreshToken } from '../config/jwt.js'
import pool from '../config/db.js'

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' })

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })

    const existing = await User.findByEmail(email)
    if (existing)
      return res.status(409).json({ success: false, message: 'Email already registered' })

    const id = await User.create({ name, email, password })
    const user = await User.findById(id)
    const token = generateToken({ id: user.id, role: user.role, email: user.email })

    res.status(201).json({ success: true, message: 'Account created successfully', data: { user, token } })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' })

    const user = await User.findByEmail(email)
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email or password' })

    if (!user.is_active)
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact support.' })

    const valid = await User.comparePassword(password, user.password)
    if (!valid)
      return res.status(401).json({ success: false, message: 'Invalid email or password' })

    const token = generateToken({ id: user.id, role: user.role, email: user.email })
    const refreshToken = generateRefreshToken({ id: user.id })

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await pool.query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, refreshToken, expiresAt])

    const { password: _, ...safeUser } = user
    res.json({ success: true, message: 'Login successful', data: { user: safeUser, token, refreshToken } })
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, data: { user } })
  } catch (err) {
    next(err)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, location, bio } = req.body
    await User.update(req.user.id, { name, phone, location, bio })
    const user = await User.findById(req.user.id)
    res.json({ success: true, message: 'Profile updated', data: { user } })
  } catch (err) {
    next(err)
  }
}

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findByEmail(req.user.email)
    const valid = await User.comparePassword(currentPassword, user.password)
    if (!valid)
      return res.status(400).json({ success: false, message: 'Current password is incorrect' })
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' })
    await User.changePassword(req.user.id, newPassword)
    res.json({ success: true, message: 'Password changed successfully' })
  } catch (err) {
    next(err)
  }
}

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (refreshToken) {
      await pool.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken])
    }
    res.json({ success: true, message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
}
