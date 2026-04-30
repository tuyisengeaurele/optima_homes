export function success(res, data, status = 200) {
  return res.status(status).json({ success: true, data })
}

export function paginated(res, data, meta) {
  return res.json({ success: true, data, meta })
}

export function created(res, data) {
  return res.status(201).json({ success: true, data })
}

export function noContent(res) {
  return res.status(204).send()
}

export function notFound(res, message = 'Resource not found') {
  return res.status(404).json({ success: false, error: message })
}

export function forbidden(res, message = 'Forbidden') {
  return res.status(403).json({ success: false, error: message })
}

export function badRequest(res, message = 'Bad request') {
  return res.status(400).json({ success: false, error: message })
}
