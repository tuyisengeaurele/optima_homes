export const PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'studio', label: 'Studio' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
]

export const CITIES = [
  'Kigali', 'Musanze', 'Huye', 'Rubavu', 'Nyagatare',
  'Muhanga', 'Rwamagana', 'Rusizi', 'Karongi', 'Nyamata',
]

export const AMENITIES = [
  'Swimming Pool', 'Gym', 'Garden', 'Security', 'Generator',
  'Solar Power', 'CCTV', 'Parking', 'Elevator', 'WiFi',
  'Furnished', 'Air Conditioning', 'Smart Home', 'Rooftop Terrace',
  'Guest House', 'Home Cinema', 'Study Room', 'Borehole', 'Water Tank',
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'views', label: 'Most Viewed' },
]

export const INQUIRY_STATUSES = ['new', 'read', 'replied', 'closed']

export const API_BASE = import.meta.env.VITE_API_URL || ''
