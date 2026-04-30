import pool from '../config/db.js'
import { verifyRefreshToken, generateToken, generateRefreshToken } from '../config/jwt.js'

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new Error('Refresh token required')

  const decoded = verifyRefreshToken(refreshToken)

  const [[stored]] = await pool.query(
    'SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ? AND expires_at > NOW()',
    [refreshToken, decoded.id]
  )
  if (!stored) throw new Error('Invalid or expired refresh token')

  const newToken = generateToken({ id: decoded.id })
  const newRefresh = generateRefreshToken({ id: decoded.id })

  await pool.query('DELETE FROM refresh_tokens WHERE id = ?', [stored.id])
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  await pool.query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [decoded.id, newRefresh, expiresAt])

  return { token: newToken, refreshToken: newRefresh }
}

export const cleanupExpiredTokens = async () => {
  await pool.query('DELETE FROM refresh_tokens WHERE expires_at < NOW()')
}
