function sanitizeValue(value) {
  if (typeof value !== 'string') return value
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

function sanitizeObject(obj) {
  if (obj === null || typeof obj !== 'object') return sanitizeValue(obj)
  if (Array.isArray(obj)) return obj.map(sanitizeObject)
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, sanitizeObject(v)])
  )
}

export function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body)
  }
  next()
}
