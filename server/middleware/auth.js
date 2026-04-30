import { verifyToken } from '../config/jwt.js'

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' })
  }
}

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admin only.' })
  }
  next()
}

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      req.user = verifyToken(token)
    } catch {
      req.user = null
    }
  }
  next()
}
