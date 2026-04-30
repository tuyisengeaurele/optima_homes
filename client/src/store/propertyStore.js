import { create } from 'zustand'
import api from '../services/api'

export const usePropertyStore = create((set, get) => ({
  properties: [],
  featured: [],
  currentProperty: null,
  similar: [],
  total: 0,
  pages: 0,
  currentPage: 1,
  loading: false,
  error: null,
  filters: {
    type: '',
    property_type: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    min_price: '',
    max_price: '',
    sort: 'newest',
    search: '',
  },

  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters }, currentPage: 1 })),
  clearFilters: () => set({ filters: { type: '', property_type: '', city: '', bedrooms: '', bathrooms: '', min_price: '', max_price: '', sort: 'newest', search: '' }, currentPage: 1 }),
  setPage: (page) => set({ currentPage: page }),

  fetchProperties: async (page = 1, extra = {}) => {
    set({ loading: true, error: null })
    try {
      const filters = get().filters
      const params = { ...filters, ...extra, page, limit: 12 }
      const { data } = await api.get('/properties', { params })
      set({
        properties: data.data.properties,
        total: data.data.total,
        pages: data.data.pages,
        currentPage: page,
        loading: false,
      })
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || 'Failed to load properties' })
    }
  },

  fetchFeatured: async () => {
    try {
      const { data } = await api.get('/properties/featured?limit=6')
      set({ featured: data.data.properties })
    } catch {}
  },

  fetchProperty: async (id) => {
    set({ loading: true, currentProperty: null })
    try {
      const { data } = await api.get(`/properties/${id}`)
      set({ currentProperty: data.data.property, similar: data.data.similar, loading: false })
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || 'Property not found' })
    }
  },
}))
