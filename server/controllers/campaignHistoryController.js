import CampaignHistory from '../models/CampaignHistory.js'
import mongoose from 'mongoose'

export const saveCampaignHistory = async ({ userId, campaignInput, finalBrief, meta }) => {
  if (!userId || !campaignInput || !finalBrief) {
    return null
  }

  const created = await CampaignHistory.create({
    user: userId,
    campaignInput,
    finalBrief,
    meta: meta || null
  })

  return created
}

export const createCampaignHistory = async (req, res, next) => {
  try {
    const { campaignInput, finalBrief, meta } = req.body || {}

    if (!campaignInput || !finalBrief) {
      return res.status(400).json({ error: 'campaignInput and finalBrief are required.' })
    }

    const created = await saveCampaignHistory({
      userId: req.session.userId,
      campaignInput,
      finalBrief,
      meta: meta || null
    })

    return res.status(201).json({
      message: 'Campaign history saved.',
      id: created?._id || null
    })
  } catch (error) {
    return next(error)
  }
}

export const getCampaignHistory = async (req, res, next) => {
  try {
    const records = await CampaignHistory.find({ user: req.session.userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()

    const history = records.map((record) => ({
      id: record._id,
      projectTitle: record.finalBrief?.projectTitle || 'Untitled Campaign',
      generatedDate: record.finalBrief?.generatedDate || null,
      createdAt: record.createdAt,
      product: record.campaignInput?.product || '',
      audience: record.campaignInput?.audience || '',
      channels: record.campaignInput?.channels || [],
      provider: record.meta?.provider || null,
      model: record.meta?.model || null
    }))

    return res.status(200).json({ history })
  } catch (error) {
    return next(error)
  }
}

export const getCampaignHistoryById = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Campaign history not found.' })
    }

    const record = await CampaignHistory.findOne({
      _id: id,
      user: req.session.userId
    }).lean()

    if (!record) {
      return res.status(404).json({ error: 'Campaign history not found.' })
    }

    return res.status(200).json({
      record: {
        id: record._id,
        campaignInput: record.campaignInput,
        finalBrief: record.finalBrief,
        meta: record.meta,
        createdAt: record.createdAt
      }
    })
  } catch (error) {
    return next(error)
  }
}
