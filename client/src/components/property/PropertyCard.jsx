import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiBed, FiBath, FiMaximize, FiHeart, FiMapPin, FiEye } from 'react-icons/fi'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'
import api from '../../services/api'

const formatPrice = (price, type) => {
  const n = Number(price)
  if (n >= 1_000_000_000) return `RWF ${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `RWF ${(n / 1_000_000).toFixed(0)}M`
  if (n >= 1_000) return `RWF ${(n / 1_000).toFixed(0)}K`
  return `RWF ${n.toLocaleString()}`
}

const typeColors = {
  sale: 'bg-emerald-500',
  rent: 'bg-royal-600',
}

const statusColors = {
  active: '',
  sold: 'bg-red-500',
  rented: 'bg-purple-500',
}

export default function PropertyCard({ property, index = 0 }) {
  const [favorited, setFavorited] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { addToast } = useUIStore()

  const toggleFavorite = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      addToast('Please login to save properties', 'info')
      return
    }
    try {
      if (favorited) {
        await api.delete(`/favorites/${property.id}`)
        addToast('Removed from saved properties', 'info')
      } else {
        await api.post(`/favorites/${property.id}`)
        addToast('Property saved!', 'success')
      }
      setFavorited(!favorited)
    } catch {
      addToast('Something went wrong', 'error')
    }
  }

  const img = property.primary_image
    ? `${import.meta.env.VITE_API_URL || ''}${property.primary_image}`
    : `https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to={`/listings/${property.id}`} className="block">
        <div className="bg-white dark:bg-navy-900 rounded-2xl overflow-hidden shadow-property hover:shadow-luxury transition-all duration-300 border border-gray-100 dark:border-navy-800">
          {/* Image */}
          <div className="relative overflow-hidden h-56">
            <img
              src={img}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Type badge */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white uppercase ${typeColors[property.type] || 'bg-gray-500'}`}>
                For {property.type}
              </span>
              {property.status !== 'active' && (
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white uppercase ${statusColors[property.status]}`}>
                  {property.status}
                </span>
              )}
              {property.featured && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-white uppercase bg-yellow-500">
                  Featured
                </span>
              )}
            </div>

            {/* Favorite */}
            <motion.button
              onClick={toggleFavorite}
              whileTap={{ scale: 0.85 }}
              className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                favorited ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'
              }`}
            >
              <FiHeart size={16} fill={favorited ? 'currentColor' : 'none'} />
            </motion.button>

            {/* Views */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white/80 text-xs">
              <FiEye size={12} />
              <span>{property.views || 0}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-navy-900 dark:text-white text-base leading-tight line-clamp-2 group-hover:text-royal-600 transition-colors">
                {property.title}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mb-3">
              <FiMapPin size={13} className="text-royal-500 flex-shrink-0" />
              <span className="truncate">{property.city}, {property.country}</span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="text-xl font-bold text-navy-900 dark:text-white">
                {formatPrice(property.price)}
              </span>
              {property.type === 'rent' && (
                <span className="text-gray-400 text-sm">/month</span>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-100 dark:border-navy-800">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
                  <FiBed size={15} className="text-royal-500" />
                  <span>{property.bedrooms} Bed</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
                  <FiBath size={15} className="text-royal-500" />
                  <span>{property.bathrooms} Bath</span>
                </div>
              )}
              {property.area && (
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
                  <FiMaximize size={14} className="text-royal-500" />
                  <span>{property.area} m²</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
