import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'optimahomes_super_secret_2024'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'optimahomes_refresh_secret_2024'

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' })
}

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET)
}

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET)
}
