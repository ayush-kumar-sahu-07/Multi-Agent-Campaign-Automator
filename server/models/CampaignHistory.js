import mongoose from 'mongoose'

const campaignHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    campaignInput: {
      type: Object,
      required: true
    },
    finalBrief: {
      type: Object,
      required: true
    },
    meta: {
      type: Object,
      default: null
    }
  },
  {
    timestamps: true
  }
)

const CampaignHistory = mongoose.model('CampaignHistory', campaignHistorySchema)

export default CampaignHistory
