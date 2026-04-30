import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import PropertyCard from '../../components/property/PropertyCard'
import { SkeletonCard } from '../../components/common/Skeleton'

export default function SavedProperties() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/favorites').then(({ data }) => {
      setFavorites(data.data.favorites)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <FiHeart size={22} className="text-red-500" />
            <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Saved Properties</h1>
            <span className="px-2 py-0.5 bg-gray-200 dark:bg-navy-700 text-gray-600 dark:text-gray-300 text-sm rounded-full">{favorites.length}</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-navy-900 rounded-2xl shadow-property">
              <FiHeart size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-navy-900 dark:text-white mb-2">No saved properties yet</h3>
              <p className="text-gray-400 mb-6">Start saving properties you love</p>
              <Link to="/listings" className="px-6 py-3 bg-royal-600 text-white rounded-xl font-medium hover:bg-royal-700 transition-all">
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
