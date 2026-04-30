import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFilter, FiGrid, FiList, FiX, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { usePropertyStore } from '../store/propertyStore'
import PropertyCard from '../components/property/PropertyCard'
import { SkeletonCard } from '../components/common/Skeleton'

const CITIES = ['Kigali', 'Musanze', 'Huye', 'Rubavu', 'Nyagatare', 'Muhanga']
const PROPERTY_TYPES = ['house', 'apartment', 'villa', 'condo', 'townhouse', 'studio', 'land', 'commercial']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'views', label: 'Most Viewed' },
]

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [view, setView] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const { properties, total, pages, currentPage, loading, filters, setFilters, clearFilters, fetchProperties } = usePropertyStore()

  const [localFilters, setLocalFilters] = useState({
    type: searchParams.get('type') || '',
    property_type: searchParams.get('property_type') || '',
    city: searchParams.get('city') || '',
    bedrooms: '',
    bathrooms: '',
    min_price: '',
    max_price: '',
    sort: 'newest',
    search: searchParams.get('search') || '',
    featured: searchParams.get('featured') || '',
  })

  useEffect(() => {
    setFilters(localFilters)
    fetchProperties(1, localFilters)
  }, [])

  const applyFilters = () => {
    setFilters(localFilters)
    fetchProperties(1, localFilters)
    setShowFilters(false)
  }

  const handleClearFilters = () => {
    const reset = { type: '', property_type: '', city: '', bedrooms: '', bathrooms: '', min_price: '', max_price: '', sort: 'newest', search: '', featured: '' }
    setLocalFilters(reset)
    clearFilters()
    fetchProperties(1, reset)
  }

  const changePage = (p) => {
    fetchProperties(p, localFilters)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasFilters = Object.entries(localFilters).some(([k, v]) => v && k !== 'sort')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-1">Property Listings</h1>
          <p className="text-gray-500 dark:text-gray-400">{total} properties found</p>
        </div>

        {/* Filter bar */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-property p-4 mb-6 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search properties..."
              value={localFilters.search}
              onChange={(e) => setLocalFilters(p => ({ ...p, search: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-400"
            />
          </div>

          {/* Type */}
          <div className="flex gap-1 bg-gray-50 dark:bg-navy-800 rounded-xl p-1">
            {['', 'sale', 'rent'].map(t => (
              <button
                key={t}
                onClick={() => { setLocalFilters(p => ({ ...p, type: t })); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  localFilters.type === t ? 'bg-royal-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-navy-900 dark:hover:text-white'
                }`}
              >
                {t === '' ? 'All' : t === 'sale' ? 'Buy' : 'Rent'}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={localFilters.sort}
            onChange={(e) => setLocalFilters(p => ({ ...p, sort: e.target.value }))}
            className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Filter btn */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              hasFilters ? 'border-royal-500 bg-royal-50 dark:bg-royal-900/20 text-royal-600' : 'border-gray-200 dark:border-navy-700 text-gray-600 dark:text-gray-300 hover:border-royal-400'
            }`}
          >
            <FiFilter size={15} />
            Filters {hasFilters && '•'}
          </button>

          {/* Apply */}
          <button
            onClick={applyFilters}
            className="px-5 py-2.5 bg-royal-600 hover:bg-royal-700 text-white text-sm font-medium rounded-xl transition-all"
          >
            Search
          </button>

          {/* View toggle */}
          <div className="flex gap-1 bg-gray-50 dark:bg-navy-800 rounded-xl p-1">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white dark:bg-navy-700 shadow-sm text-royal-600' : 'text-gray-400'}`}>
              <FiGrid size={16} />
            </button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white dark:bg-navy-700 shadow-sm text-royal-600' : 'text-gray-400'}`}>
              <FiList size={16} />
            </button>
          </div>
        </div>

        {/* Advanced filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="bg-white dark:bg-navy-900 rounded-2xl shadow-property p-5 mb-6"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Property Type</label>
                  <select
                    value={localFilters.property_type}
                    onChange={(e) => setLocalFilters(p => ({ ...p, property_type: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none capitalize"
                  >
                    <option value="">Any Type</option>
                    {PROPERTY_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">City</label>
                  <select
                    value={localFilters.city}
                    onChange={(e) => setLocalFilters(p => ({ ...p, city: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none"
                  >
                    <option value="">Any City</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Min Bedrooms</label>
                  <select
                    value={localFilters.bedrooms}
                    onChange={(e) => setLocalFilters(p => ({ ...p, bedrooms: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none"
                  >
                    <option value="">Any</option>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}+</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Min Bathrooms</label>
                  <select
                    value={localFilters.bathrooms}
                    onChange={(e) => setLocalFilters(p => ({ ...p, bathrooms: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none"
                  >
                    <option value="">Any</option>
                    {[1,2,3,4].map(n => <option key={n} value={n}>{n}+</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Min Price (RWF)</label>
                  <input
                    type="number"
                    placeholder="e.g. 50000000"
                    value={localFilters.min_price}
                    onChange={(e) => setLocalFilters(p => ({ ...p, min_price: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Max Price (RWF)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500000000"
                    value={localFilters.max_price}
                    onChange={(e) => setLocalFilters(p => ({ ...p, max_price: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none"
                  />
                </div>
              </div>
              {hasFilters && (
                <button onClick={handleClearFilters} className="mt-4 flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors">
                  <FiX size={14} /> Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Properties grid */}
        {loading ? (
          <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-navy-900 dark:text-white mb-2">No properties found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
            <button onClick={handleClearFilters} className="px-6 py-3 bg-royal-600 text-white rounded-xl font-medium">Clear Filters</button>
          </div>
        ) : (
          <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {properties.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 text-navy-700 dark:text-gray-300 disabled:opacity-40"
            >
              <FiChevronLeft size={18} />
            </button>
            {[...Array(pages)].map((_, i) => {
              const p = i + 1
              if (p === 1 || p === pages || Math.abs(p - currentPage) <= 1) {
                return (
                  <button
                    key={p}
                    onClick={() => changePage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                      p === currentPage ? 'bg-royal-600 text-white' : 'bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 text-navy-700 dark:text-gray-300 hover:border-royal-400'
                    }`}
                  >
                    {p}
                  </button>
                )
              }
              if (Math.abs(p - currentPage) === 2) return <span key={p} className="text-gray-400">…</span>
              return null
            })}
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === pages}
              className="p-2 rounded-xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 text-navy-700 dark:text-gray-300 disabled:opacity-40"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
