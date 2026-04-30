import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { FiUser, FiSave, FiLock } from 'react-icons/fi'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'
import api from '../../services/api'

export default function UserProfile() {
  const { user, updateProfile } = useAuthStore()
  const { addToast } = useUIStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name, phone: user?.phone || '', location: user?.location || '', bio: user?.bio || '' }
  })
  const { register: regPass, handleSubmit: submitPass, reset: resetPass, watch, formState: { errors: passErrors } } = useForm()
  const newPwd = watch('newPassword')

  const onProfile = async (data) => {
    setSaving(true)
    try {
      await updateProfile(data)
      addToast('Profile updated successfully!', 'success')
    } catch { addToast('Update failed', 'error') }
    finally { setSaving(false) }
  }

  const onPassword = async ({ currentPassword, newPassword }) => {
    setSaving(true)
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword })
      addToast('Password changed successfully!', 'success')
      resetPass()
    } catch (err) { addToast(err.response?.data?.message || 'Failed', 'error') }
    finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-6">Profile Settings</h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-white dark:bg-navy-900 rounded-xl p-1 shadow-property">
            {[{ id: 'profile', label: 'Profile', icon: FiUser }, { id: 'password', label: 'Password', icon: FiLock }].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === t.id ? 'bg-royal-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-navy-900 dark:hover:text-white'
                }`}>
                <t.icon size={15} /> {t.label}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-property p-6 border border-gray-100 dark:border-navy-800">
            {activeTab === 'profile' ? (
              <>
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-navy-800">
                  <div className="w-16 h-16 rounded-full bg-gradient-royal flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900 dark:text-white">{user?.name}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                    <span className="text-xs text-royal-600 capitalize">{user?.role}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onProfile)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    <input {...register('name', { required: true })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                    <input {...register('phone')} placeholder="+250 ..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Location</label>
                    <input {...register('location')} placeholder="City, Country"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
                    <textarea {...register('bio')} rows={3} placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 transition-all resize-none" />
                  </div>
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-royal-600 hover:bg-royal-700 disabled:opacity-60 text-white font-medium rounded-xl transition-all">
                    <FiSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </>
            ) : (
              <form onSubmit={submitPass(onPassword)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
                  <input {...regPass('currentPassword', { required: 'Required' })} type="password"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 transition-all" />
                  {passErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{passErrors.currentPassword.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                  <input {...regPass('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })} type="password"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 transition-all" />
                  {passErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passErrors.newPassword.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
                  <input {...regPass('confirmPassword', { required: 'Required', validate: v => v === newPwd || 'Passwords must match' })} type="password"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-sm text-navy-900 dark:text-white outline-none focus:border-royal-500 transition-all" />
                  {passErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passErrors.confirmPassword.message}</p>}
                </div>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-royal-600 hover:bg-royal-700 disabled:opacity-60 text-white font-medium rounded-xl transition-all">
                  <FiLock size={16} /> {saving ? 'Saving...' : 'Change Password'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
