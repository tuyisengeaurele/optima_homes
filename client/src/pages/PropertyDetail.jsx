import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiBed, FiBath, FiMaximize, FiMapPin, FiCalendar, FiHeart,
  FiShare2, FiPhone, FiMail, FiCheck, FiEye, FiArrowLeft,
} from 'react-icons/fi'
import { usePropertyStore } from '../store/propertyStore'
import { useAuthStore } from '../store/authStore'
import { useUIStore } from '../store/uiStore'
import { useForm } from 'react-hook-form'
import PropertyCard from '../components/property/PropertyCard'
import { SkeletonDetail } from '../components/common/Skeleton'
import api from '../services/api'

const formatPrice = (price) => {
  const n = Number(price)
  if (n >= 1_000_000_000) return `RWF ${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `RWF ${(n / 1_000_000).toFixed(0)}M`
  return `RWF ${n.toLocaleString()}`
}

export default function PropertyDetail() {
  const { id } = useParams()
  const { currentProperty: property, similar, loading, fetchProperty } = usePropertyStore()
  const { user, isAuthenticated } = useAuthStore()
  const { addToast } = useUIStore()
  const [activeImg, setActiveImg] = useState(0)
  const [favorited, setFavorited] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '', phone: user?.phone || '', message: '' }
  })

  useEffect(() => {
    fetchProperty(id)
    window.scrollTo(0, 0)
  }, [id])

  const imgs = property?.images?.length > 0
    ? property.images.map(i => `${import.meta.env.VITE_API_URL || ''}${i.image_url}`)
    : ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80']

  const onInquiry = async (data) => {
    setSubmitting(true)
    try {
      await api.post(`/inquiries/property/${id}`, data)
      addToast('Inquiry sent! We will contact you soon.', 'success')
      reset({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', message: '' })
    } catch {
      addToast('Failed to send inquiry. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleFav = async () => {
    if (!isAuthenticated) { addToast('Please login to save properties', 'info'); return }
    try {
      if (favorited) { await api.delete(`/favorites/${id}`); addToast('Removed from saved', 'info') }
      else { await api.post(`/favorites/${id}`); addToast('Saved to favorites!', 'success') }
      setFavorited(!favorited)
    } catch { addToast('Something went wrong', 'error') }
  }

  const share = () => {
    navigator.clipboard?.writeText(window.location.href)
    addToast('Link copied to clipboard!', 'success')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4"><SkeletonDetail /></div>
    </div>
  )

  if (!property) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🏠</div>
        <h2 className="text-xl font-semibold text-navy-900 dark:text-white mb-2">Property Not Found</h2>
        <Link to="/listings" className="text-royal-600 hover:underline">Back to Listings</Link>
      </div>
    </div>
  )

  const amenities = property.amenities
    ? (typeof property.amenities === 'string' ? JSON.parse(property.amenities) : property.amenities)
    : []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link to="/listings" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-royal-600 mb-6">
          <FiArrowLeft size={16} /> Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div className="bg-white dark:bg-navy-900 rounded-2xl overflow-hidden shadow-property"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="relative h-[400px] overflow-hidden">
                <motion.img
                  key={activeImg}
                  src={imgs[activeImg]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white uppercase ${property.type === 'sale' ? 'bg-emerald-500' : 'bg-royal-600'}`}>
                    For {property.type}
                  </span>
                  {property.featured && <span className="px-3 py-1 rounded-lg text-xs font-bold text-white uppercase bg-yellow-500">Featured</span>}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button onClick={toggleFav} whileTap={{ scale: 0.85 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm ${favorited ? 'bg-red-500 text-white' : 'bg-black/30 text-white'}`}>
                    <FiHeart size={18} fill={favorited ? 'currentColor' : 'none'} />
                  </motion.button>
                  <motion.button onClick={share} whileTap={{ scale: 0.85 }}
                    className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center">
                    <FiShare2 size={18} />
                  </motion.button>
                </div>
                <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-lg">
                  <FiEye size={12} /> {property.views} views
                </div>
              </div>
              {imgs.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {imgs.map((src, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-royal-500' : 'border-transparent'}`}>
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-property"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                    <FiMapPin size={14} className="text-royal-500" />
                    <span>{property.address}, {property.city}, {property.country}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-navy-900 dark:text-white">
                    {formatPrice(property.price)}
                  </div>
                  {property.type === 'rent' && <span className="text-gray-400 text-sm">/month</span>}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-gray-100 dark:border-navy-800 mb-5">
                {property.bedrooms > 0 && (
                  <div className="text-center">
                    <FiBed size={20} className="text-royal-500 mx-auto mb-1" />
                    <div className="text-sm font-semibold text-navy-900 dark:text-white">{property.bedrooms}</div>
                    <div className="text-xs text-gray-400">Bedrooms</div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="text-center">
                    <FiBath size={20} className="text-royal-500 mx-auto mb-1" />
                    <div className="text-sm font-semibold text-navy-900 dark:text-white">{property.bathrooms}</div>
                    <div className="text-xs text-gray-400">Bathrooms</div>
                  </div>
                )}
                {property.area && (
                  <div className="text-center">
                    <FiMaximize size={20} className="text-royal-500 mx-auto mb-1" />
                    <div className="text-sm font-semibold text-navy-900 dark:text-white">{property.area}</div>
                    <div className="text-xs text-gray-400">m² Area</div>
                  </div>
                )}
                {property.year_built && (
                  <div className="text-center">
                    <FiCalendar size={20} className="text-royal-500 mx-auto mb-1" />
                    <div className="text-sm font-semibold text-navy-900 dark:text-white">{property.year_built}</div>
                    <div className="text-xs text-gray-400">Year Built</div>
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-navy-900 dark:text-white mb-3">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-5">{property.description}</p>

              {amenities.length > 0 && (
                <>
                  <h3 className="font-semibold text-navy-900 dark:text-white mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {amenities.map(a => (
                      <div key={a} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiCheck size={14} className="text-emerald-500 flex-shrink-0" />
                        {a}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            {/* Map placeholder */}
            <motion.div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-property"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="font-semibold text-navy-900 dark:text-white mb-4">Location</h3>
              <div className="bg-gray-100 dark:bg-navy-800 rounded-xl h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-navy-700">
                <div className="text-center text-gray-400">
                  <FiMapPin size={32} className="mx-auto mb-2" />
                  <p className="text-sm">{property.address}</p>
                  <p className="text-sm">{property.city}, {property.country}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Contact form */}
          <div className="space-y-5">
            <motion.div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-property sticky top-28"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="font-semibold text-navy-900 dark:text-white mb-1">Contact Agent</h3>
              <p className="text-xs text-gray-400 mb-5">Send an inquiry about this property</p>

              <form onSubmit={handleSubmit(onInquiry)} className="space-y-4">
                <div>
                  <input {...register('name', { required: 'Name required' })}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-400 transition-colors"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <input {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                    type="email" placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-400 transition-colors"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <input {...register('phone')}
                    placeholder="Phone Number (optional)"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-400 transition-colors"
                  />
                </div>
                <div>
                  <textarea {...register('message', { required: 'Message required' })}
                    rows={4} placeholder="I'm interested in this property and would like to schedule a viewing..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-400 transition-colors resize-none"
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>
                <motion.button type="submit" disabled={submitting}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="w-full py-3 bg-royal-600 hover:bg-royal-700 disabled:opacity-60 text-white font-medium rounded-xl transition-all">
                  {submitting ? 'Sending...' : 'Send Inquiry'}
                </motion.button>
              </form>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-navy-800 flex gap-3">
                <a href="tel:+250788000000" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-navy-700 rounded-xl text-sm text-navy-700 dark:text-gray-300 hover:border-royal-400 transition-all">
                  <FiPhone size={15} /> Call
                </a>
                <a href="mailto:info@optimahomes.rw" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-navy-700 rounded-xl text-sm text-navy-700 dark:text-gray-300 hover:border-royal-400 transition-all">
                  <FiMail size={15} /> Email
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similar.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
