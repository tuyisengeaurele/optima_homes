import { Property } from '../models/Property.js'
import path from 'path'

export const getProperties = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, ...filters } = req.query
    const result = await Property.getAll(filters, Number(page), Number(limit))
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export const getProperty = async (req, res, next) => {
  try {
    const property = await Property.getById(req.params.id)
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' })

    const similar = await Property.getSimilar(property.id, property.type, property.city)
    res.json({ success: true, data: { property, similar } })
  } catch (err) {
    next(err)
  }
}

export const getFeatured = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 6
    const properties = await Property.getFeatured(limit)
    res.json({ success: true, data: { properties } })
  } catch (err) {
    next(err)
  }
}

export const createProperty = async (req, res, next) => {
  try {
    const data = { ...req.body, admin_id: req.user.id }
    if (data.amenities && typeof data.amenities === 'string') {
      data.amenities = JSON.parse(data.amenities)
    }
    const id = await Property.create(data)

    if (req.files && req.files.length > 0) {
      const images = req.files.map(f => ({ url: `/uploads/properties/${f.filename}` }))
      await Property.addImages(id, images)
    }

    const property = await Property.getById(id)
    res.status(201).json({ success: true, message: 'Property created successfully', data: { property } })
  } catch (err) {
    next(err)
  }
}

export const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.getById(req.params.id)
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' })

    const data = { ...req.body }
    if (data.amenities && typeof data.amenities === 'string') {
      data.amenities = JSON.parse(data.amenities)
    }
    await Property.update(req.params.id, data)

    if (req.files && req.files.length > 0) {
      const images = req.files.map(f => ({ url: `/uploads/properties/${f.filename}` }))
      await Property.addImages(req.params.id, images)
    }

    const updated = await Property.getById(req.params.id)
    res.json({ success: true, message: 'Property updated', data: { property: updated } })
  } catch (err) {
    next(err)
  }
}

export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.getById(req.params.id)
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' })
    await Property.delete(req.params.id)
    res.json({ success: true, message: 'Property deleted' })
  } catch (err) {
    next(err)
  }
}

export const deletePropertyImage = async (req, res, next) => {
  try {
    await Property.deleteImage(req.params.imageId)
    res.json({ success: true, message: 'Image deleted' })
  } catch (err) {
    next(err)
  }
}

export const getPropertyStats = async (req, res, next) => {
  try {
    const stats = await Property.getStats()
    res.json({ success: true, data: { stats } })
  } catch (err) {
    next(err)
  }
}
