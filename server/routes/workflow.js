import { Router } from 'express'
import { campaignInputSchema } from '../schemas/briefSchema.js'
import { runWorkflow } from '../services/workflowOrchestrator.js'
import { saveCampaignHistory } from '../controllers/campaignHistoryController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/run', requireAuth, async (req, res, next) => {
  try {
    const parsedInput = campaignInputSchema.safeParse(req.body)

    if (!parsedInput.success) {
      return res.status(400).json({
        error: 'Invalid input payload',
        issues: parsedInput.error.issues
      })
    }

    const result = await runWorkflow(parsedInput.data)

    if (!result.finalBrief) {
      return res.status(502).json({
        error: 'Final brief validation failed',
        agents: result.agents,
        meta: result.meta
      })
    }

    let historyId = null
    if (req.session?.userId) {
      try {
        const created = await saveCampaignHistory({
          userId: req.session.userId,
          campaignInput: parsedInput.data,
          finalBrief: result.finalBrief,
          meta: result.meta
        })
        historyId = created?._id || null
      } catch (historyError) {
        console.warn('Campaign history save failed:', historyError?.message || historyError)
      }
    }

    return res.json({
      ...result,
      historyId
    })
  } catch (error) {
    return next(error)
  }
})

export default router
