import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiArrowRight, FiStar, FiShield, FiAward, FiUsers } from 'react-icons/fi'
import { MdApartment, MdHouse, MdVilla, MdBusiness } from 'react-icons/md'
import { usePropertyStore } from '../store/propertyStore'
import PropertyCard from '../components/property/PropertyCard'
import { SkeletonCard } from '../components/common/Skeleton'
import { useState } from 'react'

const heroImages = [
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=90',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=90',
]

const categories = [
  { icon: MdHouse, label: 'Houses', value: 'house', color: 'from-blue-500 to-blue-700' },
  { icon: MdApartment, label: 'Apartments', value: 'apartment', color: 'from-purple-500 to-purple-700' },
  { icon: MdVilla, label: 'Villas', value: 'villa', color: 'from-emerald-500 to-emerald-700' },
  { icon: MdBusiness, label: 'Commercial', value: 'commercial', color: 'from-orange-500 to-orange-700' },
]

const stats = [
  { icon: FiUsers, value: '500+', label: 'Happy Clients' },
  { icon: MdHouse, value: '1200+', label: 'Properties' },
  { icon: FiStar, value: '4.9', label: 'Rating' },
  { icon: FiAward, value: '8+', label: 'Years Experience' },
]

const testimonials = [
  {
    name: 'Alice Uwase', role: 'Homeowner',
    avatar: 'https://i.pravatar.cc/60?img=47',
    text: 'OptimaHomes made my property search effortless. Found my dream villa in Kiyovu within weeks. The team is incredibly professional!',
    stars: 5,
  },
  {
    name: 'Bob Kamanzi', role: 'Real Estate Investor',
    avatar: 'https://i.pravatar.cc/60?img=12',
    text: 'As an investor, I needed reliable listings and market data. OptimaHomes delivers exactly that. Closed 3 deals this year through their platform.',
    stars: 5,
  },
  {
    name: 'Grace Ineza', role: 'First-time Buyer',
    avatar: 'https://i.pravatar.cc/60?img=23',
    text: 'The search filters are incredibly detailed. I could specify exactly what I needed and found the perfect apartment in Kacyiru. Highly recommended!',
    stars: 5,
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function Home() {
  const [heroIdx, setHeroIdx] = useState(0)
  const [searchType, setSearchType] = useState('sale')
  const [searchQuery, setSearchQuery] = useState('')
  const { featured, fetchFeatured, loading } = usePropertyStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchFeatured()
    const interval = setInterval(() => setHeroIdx((i) => (i + 1) % heroImages.length), 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/listings?type=${searchType}&search=${searchQuery}`)
  }

  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background slideshow */}
        {heroImages.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: i === heroIdx ? 1 : 0 }}
            transition={{ duration: 1.2 }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/70 via-navy-900/50 to-navy-900/80" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 bg-royal-600/20 border border-royal-400/30 text-royal-300 text-sm rounded-full mb-6 backdrop-blur-sm">
              Your Trusted Real Estate Partner in Rwanda
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa, #3b82f6)' }}>
                Dream Home
              </span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Discover premium properties for sale and rent across Rwanda. From cozy apartments to luxury villas — your perfect home awaits.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            className="glass rounded-2xl p-2 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="flex bg-white/10 rounded-xl overflow-hidden">
                {['sale', 'rent'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSearchType(t)}
                    className={`px-5 py-3 text-sm font-medium capitalize transition-all ${
                      searchType === t
                        ? 'bg-royal-600 text-white rounded-xl'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {t === 'sale' ? 'Buy' : 'Rent'}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, city, or property type..."
                className="flex-1 bg-white/10 text-white placeholder-white/50 px-5 py-3 rounded-xl outline-none text-sm"
              />
              <motion.button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-royal-600 hover:bg-royal-700 text-white font-medium rounded-xl transition-all shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiSearch size={18} />
                <span>Search</span>
              </motion.button>
            </form>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-white/60 text-xs">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 bg-gray-50 dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-3">
              Browse by Property Type
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Find exactly what you're looking for</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map(({ icon: Icon, label, value, color }, i) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <Link
                  to={`/listings?property_type=${value}`}
                  className="flex flex-col items-center gap-4 p-8 bg-white dark:bg-navy-900 rounded-2xl shadow-property hover:shadow-luxury transition-all border border-gray-100 dark:border-navy-800"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <span className="font-semibold text-navy-900 dark:text-white">{label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ── */}
      <section className="py-20 dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="flex items-end justify-between mb-12" {...fadeUp}>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-2">
                Featured Properties
              </h2>
              <p className="text-gray-500 dark:text-gray-400">Hand-picked premium listings</p>
            </div>
            <Link
              to="/listings?featured=true"
              className="hidden sm:flex items-center gap-2 text-royal-600 hover:text-royal-700 font-medium text-sm"
            >
              View All <FiArrowRight />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((property, i) => (
                <PropertyCard key={property.id} property={property} index={i} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-8 py-3 bg-navy-900 dark:bg-royal-600 hover:bg-navy-800 dark:hover:bg-royal-700 text-white font-medium rounded-xl transition-all shadow-lg"
            >
              Explore All Listings <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{ width: 200 + i * 150, height: 200 + i * 150, left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
            />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Choose OptimaHomes?</h2>
            <p className="text-white/60 max-w-xl mx-auto">We bring expertise, trust, and innovation to every property transaction</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FiShield, title: 'Verified Listings', desc: 'Every property is vetted by our expert team to ensure authenticity and accuracy of information.' },
              { icon: FiUsers, title: 'Expert Agents', desc: 'Our experienced agents provide personalized guidance throughout your entire property journey.' },
              { icon: FiAward, title: 'Best Value', desc: 'We negotiate the best deals for our clients, ensuring you get maximum value for your investment.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                className="text-center p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-royal-600/20 border border-royal-500/30 flex items-center justify-center mx-auto mb-5">
                  <Icon size={28} className="text-royal-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-white/60 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-gray-50 dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-3">
              What Our Clients Say
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Real stories from happy homeowners</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-property border border-gray-100 dark:border-navy-800"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, j) => (
                    <FiStar key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-navy-900 dark:text-white text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            className="bg-gradient-luxury rounded-3xl p-12 text-white shadow-luxury"
            {...fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
            <p className="text-white/70 mb-8 text-lg">Join thousands of satisfied clients who found their perfect property through OptimaHomes</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/listings"
                className="px-8 py-4 bg-white text-navy-900 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
              >
                Browse Properties
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Contact an Agent
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
