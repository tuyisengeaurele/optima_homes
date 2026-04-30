import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { FiMapPin, FiPhone, FiMail, FiSend, FiCheck } from 'react-icons/fi'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 1000))
    setSent(true)
    reset()
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-luxury py-32 text-white text-center">
        <motion.div className="max-w-2xl mx-auto px-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-white/70 text-lg">We'd love to hear from you. Our team is here to help!</p>
        </motion.div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-navy-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Info */}
            <div className="lg:col-span-2 space-y-6">
              {[
                { icon: FiMapPin, title: 'Office', lines: ['KG 15 Ave, Kigali', 'Rwanda'] },
                { icon: FiPhone, title: 'Phone', lines: ['+250 788 000 000', 'Mon–Fri 8am–6pm'] },
                { icon: FiMail, title: 'Email', lines: ['info@optimahomes.rw', 'support@optimahomes.rw'] },
              ].map(({ icon: Icon, title, lines }) => (
                <div key={title} className="flex gap-4 p-5 bg-white dark:bg-navy-900 rounded-2xl shadow-property">
                  <div className="w-10 h-10 rounded-xl bg-royal-50 dark:bg-royal-900/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-royal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-900 dark:text-white text-sm mb-1">{title}</h4>
                    {lines.map(l => <p key={l} className="text-gray-500 dark:text-gray-400 text-sm">{l}</p>)}
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <motion.div className="lg:col-span-3 bg-white dark:bg-navy-900 rounded-2xl shadow-property p-8"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-6">Send a Message</h2>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <FiCheck size={28} className="text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400 text-sm">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input {...register('name', { required: true })} placeholder="Your Name"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 transition-all" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">Required</p>}
                    </div>
                    <div>
                      <input {...register('email', { required: true, pattern: /^\S+@\S+$/ })} type="email" placeholder="Email"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 transition-all" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">Valid email required</p>}
                    </div>
                  </div>
                  <input {...register('subject', { required: true })} placeholder="Subject"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 transition-all" />
                  <textarea {...register('message', { required: true })} rows={5} placeholder="Your message..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 transition-all resize-none" />
                  <motion.button type="submit" disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 bg-royal-600 hover:bg-royal-700 disabled:opacity-60 text-white font-medium rounded-xl transition-all"
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <FiSend size={16} />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
