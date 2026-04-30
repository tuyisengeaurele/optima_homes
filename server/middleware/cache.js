const store = new Map()

export function memCache(ttlSeconds = 60) {
  return (req, res, next) => {
    if (req.method !== 'GET') return next()

    const key = req.originalUrl
    const cached = store.get(key)

    if (cached && Date.now() < cached.expiresAt) {
      return res.json(cached.data)
    }

    const originalJson = res.json.bind(res)
    res.json = (data) => {
      store.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 })
      return originalJson(data)
    }

    next()
  }
}

export function clearCache(pattern) {
  for (const key of store.keys()) {
    if (!pattern || key.includes(pattern)) store.delete(key)
  }
}
