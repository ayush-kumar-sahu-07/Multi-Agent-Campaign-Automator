import { Router } from 'express'
import {
  signup,
  login,
  logout,
  getSessionUser,
  getDashboard
} from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.get('/session', getSessionUser)
router.get('/dashboard', requireAuth, getDashboard)

export default router
