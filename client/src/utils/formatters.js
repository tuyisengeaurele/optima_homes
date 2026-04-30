export const formatPrice = (price, type) => {
  const n = Number(price)
  let formatted
  if (n >= 1_000_000_000) formatted = `RWF ${(n / 1_000_000_000).toFixed(1)}B`
  else if (n >= 1_000_000) formatted = `RWF ${(n / 1_000_000).toFixed(0)}M`
  else if (n >= 1_000) formatted = `RWF ${(n / 1_000).toFixed(0)}K`
  else formatted = `RWF ${n.toLocaleString()}`
  if (type === 'rent') formatted += '/mo'
  return formatted
}

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

export const formatRelativeDate = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return formatDate(dateStr)
}

export const truncate = (str, len = 100) =>
  str?.length > len ? str.slice(0, len) + '…' : str

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : ''

export const slugify = (str) =>
  str?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
