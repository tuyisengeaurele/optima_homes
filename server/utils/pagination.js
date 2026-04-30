export function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page) || 1)
  const limit = Math.min(Math.max(1, parseInt(query.limit) || 12), 100)
  const offset = (page - 1) * limit
  return { page, limit, offset }
}

export function paginationMeta(total, page, limit) {
  const pages = Math.ceil(total / limit)
  return {
    total,
    page,
    limit,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
  }
}
