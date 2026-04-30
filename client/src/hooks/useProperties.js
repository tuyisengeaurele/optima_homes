import { usePropertyStore } from '../store/propertyStore'

export const useProperties = () => {
  const store = usePropertyStore()

  const formatPrice = (price, type) => {
    const n = Number(price)
    let formatted
    if (n >= 1_000_000_000) formatted = `RWF ${(n / 1_000_000_000).toFixed(1)}B`
    else if (n >= 1_000_000) formatted = `RWF ${(n / 1_000_000).toFixed(0)}M`
    else if (n >= 1_000) formatted = `RWF ${(n / 1_000).toFixed(0)}K`
    else formatted = `RWF ${n.toLocaleString()}`
    if (type === 'rent') formatted += '/mo'
    return formatted
  }

  return { ...store, formatPrice }
}
