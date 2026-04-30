import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { FiUpload, FiX, FiSave, FiArrowLeft } from 'react-icons/fi'
import { useUIStore } from '../../store/uiStore'
import api from '../../services/api'

const AMENITIES_LIST = ['Swimming Pool', 'Gym', 'Garden', 'Security', 'Generator', 'Solar Power', 'CCTV', 'Parking', 'Elevator', 'WiFi', 'Furnished', 'Air Conditioning', 'Smart Home', 'Rooftop Terrace']
const TYPES = ['house', 'apartment', 'villa', 'condo', 'townhouse', 'studio', 'land', 'commercial']

export default function AdminPropertyForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { addToast } = useUIStore()
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [loading, setLoading] = useState(isEdit)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { type: 'sale', status: 'active', property_type: 'house', country: 'Rwanda' }
  })

  useEffect(() => {
    if (isEdit) {
      api.get(`/properties/${id}`).then(({ data }) => {
        const p = data.data.property
        reset({
          title: p.title, description: p.description, price: p.price,
          type: p.type, status: p.status, property_type: p.property_type,
          bedrooms: p.bedrooms, bathrooms: p.bathrooms, area: p.area,
          garage: p.garage, floors: p.floors, year_built: p.year_built,
          address: p.address, city: p.city, state: p.state, country: p.country,
          latitude: p.latitude, longitude: p.longitude, featured: p.featured,
        })
        const ams = p.amenities ? (typeof p.amenities === 'string' ? JSON.parse(p.amenities) : p.amenities) : []
        setSelectedAmenities(ams)
        setLoading(false)
      }).catch(() => { addToast('Failed to load property', 'error'); navigate('/admin/properties') })
    }
  }, [id])

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    setImages(prev => [...prev, ...files])
    const urls = files.map(f => URL.createObjectURL(f))
    setPreviews(prev => [...prev, ...urls])
  }

  const removeImage = (i) => {
    setImages(prev => prev.filter((_, idx) => idx !== i))
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  const toggleAmenity = (a) => {
    setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== '') fd.append(k, v) })
      fd.append('amenities', JSON.stringify(selectedAmenities))
      images.forEach(img => fd.append('images', img))

      if (isEdit) {
        await api.put(`/properties/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        addToast('Property updated!', 'success')
      } else {
        await api.post('/properties', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        addToast('Property created!', 'success')
      }
      navigate('/admin/properties')
    } catch (err) {
      addToast(err.response?.data?.message || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8"><div className="skeleton h-96 rounded-2xl" /></div>

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/properties')} className="p-2 rounded-xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 text-gray-500">
          <FiArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
          {isEdit ? 'Edit Property' : 'Add New Property'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic info */}
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-property border border-gray-100 dark:border-navy-800">
              <h2 className="font-semibold text-navy-900 dark:text-white mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Title *</label>
                  <input {...register('title', { required: 'Required' })} placeholder="Luxury Villa in Kiyovu"
                    className="input" />
                  {errors.title && <p className="error">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="label">Description *</label>
                  <textarea {...register('description', { required: 'Required' })} rows={5} placeholder="Describe the property..."
                    className="input resize-none" />
                  {errors.description && <p className="error">{errors.description.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Price (RWF) *</label>
                    <input {...register('price', { required: 'Required' })} type="number" placeholder="e.g. 50000000"
                      className="input" />
                  </div>
                  <div>
                    <label className="label">Listing Type *</label>
                    <select {...register('type')} className="input">
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Property Type *</label>
                    <select {...register('property_type')} className="input capitalize">
                      {TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Status</label>
                    <select {...register('status')} className="input">
                      {['active', 'sold', 'rented', 'pending', 'inactive'].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-property border border-gray-100 dark:border-navy-800">
              <h2 className="font-semibold text-navy-900 dark:text-white mb-4">Property Specs</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'bedrooms', label: 'Bedrooms', min: 0 },
                  { name: 'bathrooms', label: 'Bathrooms', min: 0 },
                  { name: 'area', label: 'Area (m²)', min: 0 },
                  { name: 'garage', label: 'Garage Spaces', min: 0 },
                  { name: 'floors', label: 'Floors', min: 1 },
                  { name: 'year_built', label: 'Year Built', min: 1900 },
                ].map(({ name, label, min }) => (
                  <div key={name}>
                    <label className="label">{label}</label>
                    <input {...register(name)} type="number" min={min} className="input" />
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-property border border-gray-100 dark:border-navy-800">
              <h2 className="font-semibold text-navy-900 dark:text-white mb-4">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label">Address *</label>
                  <input {...register('address', { required: 'Required' })} className="input" />
                </div>
                <div>
                  <label className="label">City *</label>
                  <input {...register('city', { required: 'Required' })} className="input" />
                </div>
                <div>
                  <label className="label">State/District</label>
                  <input {...register('state')} className="input" />
                </div>
                <div>
                  <label className="label">Country</label>
                  <input {...register('country')} className="input" />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-property border border-gray-100 dark:border-navy-800">
              <h2 className="font-semibold text-navy-900 dark:text-white mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AMENITIES_LIST.map(a => (
                  <button key={a} type="button" onClick={() => toggleAmenity(a)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                      selectedAmenities.includes(a)
                        ? 'border-royal-500 bg-royal-50 dark:bg-royal-900/20 text-royal-600'
                        : 'border-gray-200 dark:border-navy-700 text-gray-600 dark:text-gray-400 hover:border-royal-300'
                    }`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Images + Settings */}
          <div className="space-y-5">
            {/* Images */}
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-property border border-gray-100 dark:border-navy-800">
              <h2 className="font-semibold text-navy-900 dark:text-white mb-4">Property Images</h2>
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 dark:border-navy-700 rounded-xl cursor-pointer hover:border-royal-400 transition-colors">
                <FiUpload size={20} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-400">Click to upload images</span>
                <span className="text-xs text-gray-300 mt-1">JPG, PNG, WebP up to 10MB each</span>
                <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
              </label>
              {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden">
                      <img src={src} alt="" className="w-full h-20 object-cover" />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                        <FiX size={10} />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-xs rounded">Primary</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-property border border-gray-100 dark:border-navy-800">
              <h2 className="font-semibold text-navy-900 dark:text-white mb-4">Settings</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input {...register('featured')} type="checkbox" className="w-4 h-4 rounded text-royal-600" />
                <div>
                  <div className="text-sm font-medium text-navy-900 dark:text-white">Featured Listing</div>
                  <div className="text-xs text-gray-400">Show on homepage featured section</div>
                </div>
              </label>
            </div>

            <motion.button type="submit" disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-royal-600 hover:bg-royal-700 disabled:opacity-60 text-white font-medium rounded-2xl transition-all shadow-lg text-sm"
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <FiSave size={16} />
              {saving ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
            </motion.button>
          </div>
        </div>
      </form>

      <style>{`
        .label { display: block; font-size: 0.8rem; font-weight: 500; color: #6b7280; margin-bottom: 0.375rem; }
        .input { width: 100%; padding: 0.625rem 1rem; border-radius: 0.75rem; background: rgb(249 250 251); border: 1px solid rgb(229 231 235); font-size: 0.875rem; color: rgb(13 31 60); outline: none; transition: border-color 0.15s; }
        .dark .input { background: rgb(17 26 51); border-color: rgb(30 42 80); color: white; }
        .input:focus { border-color: rgb(37 99 235); }
        .error { color: rgb(239 68 68); font-size: 0.75rem; margin-top: 0.25rem; }
      `}</style>
    </div>
  )
}
