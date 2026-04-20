import { z } from 'zod'

const nonEmpty = z.string().min(1)

export const campaignInputSchema = z.object({
  product: nonEmpty,
  audience: nonEmpty,
  channels: z.array(nonEmpty).min(1),
  goal: z.string().optional().default('Lead generation'),
  budget: z.string().optional().default('Not specified'),
  timeline: z.string().optional().default('4 weeks'),
  tone: z.string().optional().default('Confident and modern'),
  notes: z.string().optional().default('')
})

export const finalBriefSchema = z.object({
  projectTitle: nonEmpty,
  generatedDate: nonEmpty,
  executiveSummary: nonEmpty.optional(),
  overview: nonEmpty,
  marketContext: z.object({
    marketSize: nonEmpty,
    growthTrend: nonEmpty,
    keyIndustryInsights: z.array(nonEmpty).min(1)
  }).optional(),
  objectives: z.array(nonEmpty).min(3),
  targetAudience: z.object({
    primary: nonEmpty,
    secondary: nonEmpty,
    demographics: nonEmpty,
    painPoints: z.array(nonEmpty).min(2),
    psychographics: nonEmpty.optional(),
    behavioralPatterns: z.array(nonEmpty).min(1).optional()
  }),
  audienceSegmentation: z.array(
    z.object({
      segment: nonEmpty,
      characteristics: nonEmpty,
      needState: nonEmpty,
      preferredChannels: z.array(nonEmpty).min(1)
    })
  ).min(1).optional(),
  keyMessages: z.array(nonEmpty).min(3),
  messagingPillars: z.array(
    z.object({
      pillar: nonEmpty,
      supportingMessage: nonEmpty,
      proof: nonEmpty
    })
  ).min(1).optional(),
  competitiveAnalysis: z.object({
    differentiation: nonEmpty,
    opportunities: z.array(nonEmpty).min(1),
    riskFlags: z.array(nonEmpty).min(1),
    topCompetitors: z.array(
      z.object({
        name: nonEmpty,
        positioning: nonEmpty,
        messaging: nonEmpty,
        channels: z.array(nonEmpty).min(1).optional(),
        strengths: z.array(nonEmpty).min(1).optional()
      })
    ).min(1).optional()
  }).optional(),
  channelStrategy: z.object({
    primaryChannel: nonEmpty,
    secondaryChannels: z.array(nonEmpty).min(1),
    channelRationale: nonEmpty,
    integratedApproach: nonEmpty
  }).optional(),
  contentRecommendations: z.array(
    z.object({
      type: nonEmpty,
      topic: nonEmpty,
      format: nonEmpty,
      frequency: nonEmpty
    })
  ).min(1).optional(),
  adCopy: z.object({
    headline: nonEmpty,
    subheadline: nonEmpty,
    bodyPrimary: nonEmpty,
    bodySocial: nonEmpty,
    cta: nonEmpty
  }),
  creativeDirection: z.object({
    visualTheme: nonEmpty,
    colorPalette: z.object({
      primary: nonEmpty,
      secondary: nonEmpty,
      accent: nonEmpty,
      success: nonEmpty
    }),
    imagery: z.array(nonEmpty).min(3),
    designStyle: nonEmpty,
    moodBoard: z.array(nonEmpty).min(1).optional()
  }),
  channels: z.array(
    z.object({
      name: nonEmpty,
      budget: nonEmpty,
      goal: nonEmpty,
      creative: nonEmpty,
      expectedReach: nonEmpty.optional(),
      placements: z.array(nonEmpty).min(1).optional()
    })
  ).min(1),
  budgetSuggestions: z.object({
    totalBudget: nonEmpty.optional(),
    allocation: z.array(
      z.object({
        channel: nonEmpty,
        amount: nonEmpty,
        rationale: nonEmpty
      })
    ).min(1).optional(),
    contingency: nonEmpty.optional()
  }).optional(),
  postingPlan: z.object({
    week1: nonEmpty,
    week2: nonEmpty,
    week3: nonEmpty,
    week4: nonEmpty
  }),
  campaignTimeline: z.object({
    launchDate: nonEmpty.optional(),
    Duration: nonEmpty.optional(),
    keyDates: z.array(
      z.object({
        date: nonEmpty,
        milestone: nonEmpty,
        deliverable: nonEmpty
      })
    ).min(1).optional()
  }).optional(),
  riskAnalysis: z.array(
    z.object({
      risk: nonEmpty,
      probability: nonEmpty,
      impact: nonEmpty,
      mitigation: nonEmpty
    })
  ).min(1).optional(),
  metrics: z.object({
    awareness: nonEmpty,
    engagement: nonEmpty,
    conversion: nonEmpty,
    retention: nonEmpty,
    customKpis: z.array(
      z.object({
        kpi: nonEmpty,
        target: nonEmpty,
        measurableBy: nonEmpty
      })
    ).min(1).optional()
  }),
  nextStepRecommendations: z.array(nonEmpty).min(1).optional(),
  keyTakeaways: z.array(nonEmpty).min(3).optional()
})
