import { User } from '../models/User.js'

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const result = await User.getAll({ page: Number(page), limit: Number(limit) })
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, data: { user } })
  } catch (err) {
    next(err)
  }
}

export const toggleUserStatus = async (req, res, next) => {
  try {
    if (Number(req.params.id) === req.user.id)
      return res.status(400).json({ success: false, message: 'Cannot deactivate your own account' })
    await User.toggleActive(req.params.id)
    res.json({ success: true, message: 'User status toggled' })
  } catch (err) {
    next(err)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    if (Number(req.params.id) === req.user.id)
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' })
    await User.delete(req.params.id)
    res.json({ success: true, message: 'User deleted' })
  } catch (err) {
    next(err)
  }
}
