import { Link } from 'react-router-dom'
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'
import { motion } from 'framer-motion'

const footerLinks = {
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Our Team', to: '/about' },
    { label: 'Careers', to: '/contact' },
    { label: 'Contact', to: '/contact' },
  ],
  Properties: [
    { label: 'Buy Property', to: '/listings?type=sale' },
    { label: 'Rent Property', to: '/listings?type=rent' },
    { label: 'Featured Listings', to: '/listings?featured=true' },
    { label: 'New Listings', to: '/listings?sort=newest' },
  ],
  Support: [
    { label: 'FAQ', to: '/contact' },
    { label: 'Privacy Policy', to: '/contact' },
    { label: 'Terms of Service', to: '/contact' },
    { label: 'Help Center', to: '/contact' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-royal-700 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
                  <path d="M32 8L58 30V58H38V42H26V58H6V30L32 8Z" fill="none" stroke="white" strokeWidth="4" strokeLinejoin="round" />
                  <rect x="26" y="42" width="12" height="16" fill="#60a5fa" />
                  <rect x="28" y="18" width="8" height="8" rx="1" fill="#93c5fd" />
                </svg>
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">optima</span>
                <span className="text-royal-400">homes</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Your trusted partner in finding the perfect property. We connect buyers, renters, and sellers across Rwanda with premium real estate solutions.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <FiMapPin size={15} className="text-royal-400 flex-shrink-0" />
                <span>KG 15 Ave, Kigali, Rwanda</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <FiPhone size={15} className="text-royal-400 flex-shrink-0" />
                <span>+250 788 000 000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <FiMail size={15} className="text-royal-400 flex-shrink-0" />
                <span>info@optimahomes.rw</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{section}</h4>
              <ul className="space-y-3">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-gray-400 hover:text-royal-400 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-navy-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 OptimaHomes. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                className="w-9 h-9 rounded-lg bg-navy-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-royal-600 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
