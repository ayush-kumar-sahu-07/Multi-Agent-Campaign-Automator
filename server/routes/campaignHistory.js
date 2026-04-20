import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  createCampaignHistory,
  getCampaignHistory,
  getCampaignHistoryById
} from '../controllers/campaignHistoryController.js'

const router = Router()

router.post('/history', requireAuth, createCampaignHistory)
router.get('/history', requireAuth, getCampaignHistory)
router.get('/history/:id', requireAuth, getCampaignHistoryById)

export default router
