import { motion } from 'framer-motion'
import { FiAward, FiUsers, FiHome, FiStar } from 'react-icons/fi'

const team = [
  { name: 'Ange Aurele TUYISENGE', role: 'CEO & Founder', avatar: 'https://i.pravatar.cc/150?img=32' },
  { name: 'Sarah Mukamana', role: 'Head of Sales', avatar: 'https://i.pravatar.cc/150?img=44' },
  { name: 'Eric Habimana', role: 'Lead Agent', avatar: 'https://i.pravatar.cc/150?img=15' },
  { name: 'Grace Uwimana', role: 'Marketing Director', avatar: 'https://i.pravatar.cc/150?img=21' },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-luxury py-32 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white"
              style={{ width: 200 + i * 150, height: 200 + i * 150, left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />
          ))}
        </div>
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-5xl font-bold mb-4">About OptimaHomes</h1>
            <p className="text-white/70 text-lg">Rwanda's premier real estate platform connecting people with their dream properties</p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-gray-50 dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <h2 className="text-3xl font-bold text-navy-900 dark:text-white mb-5">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                At OptimaHomes, we believe everyone deserves to find their perfect home. Founded in Kigali, Rwanda, we have been connecting property buyers, sellers, and renters with their ideal spaces since 2016.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Our platform combines cutting-edge technology with local market expertise to deliver a seamless, transparent, and trustworthy real estate experience. Whether you're buying your first home, investing in property, or searching for the perfect rental, we're here to guide you every step of the way.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: FiAward, label: '8+ Years', sub: 'In Business' },
                  { icon: FiUsers, label: '500+', sub: 'Happy Clients' },
                  { icon: FiHome, label: '1,200+', sub: 'Properties Listed' },
                  { icon: FiStar, label: '4.9/5', sub: 'Client Rating' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="bg-white dark:bg-navy-900 rounded-2xl p-4 text-center shadow-property">
                    <Icon size={22} className="text-royal-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-navy-900 dark:text-white">{label}</div>
                    <div className="text-gray-400 text-xs">{sub}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
                alt="Our office"
                className="rounded-2xl shadow-luxury w-full h-80 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">Meet the Team</h2>
            <p className="text-gray-500 dark:text-gray-400">The passionate people behind OptimaHomes</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="bg-white dark:bg-navy-900 rounded-2xl p-6 text-center shadow-property hover:shadow-luxury transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-royal-100" />
                <h3 className="font-semibold text-navy-900 dark:text-white text-sm">{member.name}</h3>
                <p className="text-gray-400 text-xs mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
