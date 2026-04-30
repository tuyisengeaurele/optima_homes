export const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message })
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, message: err.message })
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'Duplicate entry. Resource already exists.' })
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
}

export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
}
