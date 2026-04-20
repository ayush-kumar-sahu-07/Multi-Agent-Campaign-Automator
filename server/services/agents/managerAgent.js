import { finalBriefSchema } from '../../schemas/briefSchema.js'

const buildFallbackBrief = ({ input, research, copy, art, competitiveIntel }) => ({
  projectTitle: `${input.product} - Campaign Brief`,
  generatedDate: new Date().toLocaleDateString(),
  executiveSummary: `Strategic campaign to position ${input.product} as the preferred solution for ${input.audience}. Digital-first approach leveraging earned, owned, and paid channels to build awareness and drive qualified conversions. 4-week sprint focused on audience fit, message-channel alignment, and measurable outcomes.`,
  overview: `${input.product} campaign designed for ${input.audience} with emphasis on ${input.goal}. This integrated campaign combines brand awareness, targeted messaging, and channel-specific creative to drive engagement and conversions. Built on competitive analysis and audience psychology to maximize ROI.`,
  marketContext: {
    marketSize: research?.marketSize || 'Growing year-over-year with digital-first adoption increasing',
    growthTrend: research?.growthTrend || 'Accelerating shift toward online evaluation and purchase',
    keyIndustryInsights: research?.trends?.slice(0, 3) || [
      'Buyers spend 60%+ of evaluation process online before engaging',
      'Social proof and peer recommendations drive 70%+ of decisions',
      'Personalization and segment-specific messaging critical for conversion'
    ]
  },
  objectives: [
    `Increase qualified awareness among ${input.audience} with 40%+ reach of target segment.`,
    `Generate consistent leads via ${input.channels.join(', ')} at cost-effective acquisition rate.`,
    'Improve conversion quality using message-channel fit and audience segmentation.',
    'Build sustainable brand positioning differentiated from competitors.',
    'Establish measurable baseline metrics for ongoing optimization.'
  ],
  targetAudience: {
    primary: input.audience,
    secondary: 'Influencers and opinion leaders within target segment',
    demographics: 'Professionals with digital-first buying behavior, typically 25-55 years old, high digital literacy',
    painPoints: [
      'Limited time to evaluate tools and services',
      'Too many options with unclear differentiation',
      'Need measurable outcomes quickly',
      'Risk of selecting wrong solution for their specific use case'
    ],
    psychographics: 'Value-driven decision-makers seeking efficiency, innovation-friendly, community-oriented',
    behavioralPatterns: [
      'Heavy online research before reaching out',
      'Consult peer reviews and case studies',
      'Respond to educational and thought leadership content'
    ]
  },
  audienceSegmentation: input.channels.map((channel, idx) => ({
    segment: `${channel} Audience ${idx + 1}`,
    characteristics: `Users active on ${channel} with demonstrated interest in ${input.product}-related solutions`,
    needState: `Seeking efficient solution for ${input.goal} with proven results and ease of implementation`,
    preferredChannels: [channel, ...input.channels.filter(c => c !== channel).slice(0, 1)]
  })) || [],
  keyMessages: [
    copy.headline || `${input.product} helps teams move faster`,
    copy.tagline || `Built specifically for ${input.audience}`,
    research.insights || 'Proven results with lower execution friction and measurable ROI'
  ],
  messagingPillars: [
    {
      pillar: 'Efficiency & Speed',
      supportingMessage: 'Reduce time-to-value and implementation complexity',
      proof: 'Case studies showing 50%+ time savings'
    },
    {
      pillar: 'Differentiation',
      supportingMessage: competitiveIntel?.differentiation || `${input.product} uniquely combines ${input.product}-specific features`,
      proof: 'Feature comparison and customer testimonials'
    },
    {
      pillar: 'Trusted by Peers',
      supportingMessage: 'Join cohorts of successful implementations in your industry',
      proof: 'Social proof, reviews, and industry recognition'
    }
  ],
  competitiveAnalysis: competitiveIntel ? {
    differentiation: competitiveIntel.differentiation || `${input.product} uniquely combines efficiency and ease-of-use tailored for ${input.audience}.`,
    opportunities: competitiveIntel.opportunities?.slice(0, 4) || [
      'Emphasize speed-to-value vs. competitors',
      'Build community around your unique differentiators',
      'Use authentic brand voice and customer stories',
      'Focus on outcome-based benefits over feature lists'
    ],
    riskFlags: competitiveIntel.riskFlags?.slice(0, 3) || [
      'Market consolidation around key established players',
      'Pricing pressure and feature parity with alternatives',
      'Messaging differentiation must be continuous and refreshed'
    ],
    topCompetitors: competitiveIntel.topCompetitors?.slice(0, 5) || []
  } : undefined,
  channelStrategy: {
    primaryChannel: input.channels?.[0] || 'Digital',
    secondaryChannels: input.channels?.slice(1) || [],
    channelRationale: `${input.channels.join(', ')} selected based on audience concentration, engagement patterns, and campaign objectives.`,
    integratedApproach: 'Cross-channel messaging consistency with channel-specific creative optimizations for format and audience.'
  },
  contentRecommendations: [
    {
      type: 'Educational',
      topic: `How ${input.product} solves ${input.goal}`,
      format: 'Blog posts, webinars, whitepapers',
      frequency: '2-3x per week'
    },
    {
      type: 'Social Proof',
      topic: 'Customer case studies and testimonials',
      format: 'Video testimonials, LinkedIn articles, reviews',
      frequency: '3-4x per week'
    },
    {
      type: 'Product-focused',
      topic: 'Feature highlights and product updates',
      format: 'Demo videos, feature deep-dives, comparison guides',
      frequency: '2x per week'
    }
  ],
  adCopy: {
    headline: copy.headline || `${input.product} for high-performance teams`,
    subheadline: copy.tagline || 'Move from idea to action faster',
    bodyPrimary: copy.adCopy?.[0] || `${input.product} helps teams plan and execute with clarity. See why ${input.audience} trust us.`,
    bodySocial: copy.adCopy?.[1] || `See how ${input.product} improves campaign speed and quality. Join hundreds of teams.`,
    cta: copy.ctaText || 'Start free trial today'
  },
  creativeDirection: {
    visualTheme: art.visualTheme || 'Modern, clean, professional with emphasis on clarity',
    colorPalette: {
      primary: `${art.colorPalette?.[0] || '#00D9FF'} (Primary)`,
      secondary: `${art.colorPalette?.[1] || '#B537F2'} (Secondary)`,
      accent: `${art.colorPalette?.[2] || '#FF2E97'} (Accent)`,
      success: `${art.colorPalette?.[3] || '#00FF94'} (Success)`
    },
    imagery: art.creativePrompts?.slice(0, 3) || [
      'Diverse professional teams collaborating',
      'Before/after workflow comparison',
      'Customer success stories and outcomes'
    ],
    designStyle: art.styleGuide || 'High contrast with modern card layouts, generous whitespace, clear hierarchy',
    moodBoard: art.styleGuide ? [`${art.styleGuide}-inspired aesthetic`] : []
  },
  channels: input.channels.map((channel) => ({
    name: channel,
    budget: input.budget || 'TBD',
    goal: input.goal || 'Lead generation',
    creative: `Tailored creative narrative for ${channel} with platform-specific formats`,
    expectedReach: 'To be determined based on budget allocation',
    placements: [`Organic ${channel}`, `Paid ${channel} ads`]
  })),
  budgetSuggestions: {
    totalBudget: input.budget || 'Not specified',
    allocation: input.channels.map((channel, idx) => ({
      channel,
      amount: `${Math.round(100 / input.channels.length)}% of total budget`,
      rationale: `Allocated based on audience concentration and channel effectiveness for ${channel}`
    })) || [],
    contingency: '10-15% of budget reserved for testing and optimization'
  },
  postingPlan: {
    week1: `Launch campaign with awareness content across ${input.channels.join(', ')}. Focus on reaching target audience and building initial brand visibility.`,
    week2: 'Publish proof points and social proof content. Provide reasons to believe and customer success stories.',
    week3: 'Run conversion pushes with strong CTAs. Focus on lead generation and product trial sign-ups.',
    week4: 'Retarget engaged users with conversion messaging. Publish social proof and testimonials. Plan for post-campaign nurture.'
  },
  campaignTimeline: {
    launchDate: 'Week 1 of campaign',
    Duration: `${input.timeline || '4 weeks'} primary campaign duration`,
    keyDates: [
      {
        date: 'Pre-campaign (Day 0)',
        milestone: 'Campaign launch readiness',
        deliverable: 'Creative assets, audience segments, channel setup'
      },
      {
        date: 'Mid-campaign (Week 2)',
        milestone: 'Performance review checkpoint',
        deliverable: 'Early metrics analysis and creative optimization recommendations'
      },
      {
        date: 'End of campaign (Week 4)',
        milestone: 'Campaign wrap-up and analysis',
        deliverable: 'Full performance report and recommendations for sustained growth'
      }
    ]
  },
  riskAnalysis: [
    {
      risk: 'Lower-than-expected engagement on primary channel',
      probability: 'Medium',
      impact: 'Delayed timeline for lead generation',
      mitigation: 'Pre-test messaging with audience segment. Have backup secondary channel ready to shift budget.'
    },
    {
      risk: 'Message-market fit issues',
      probability: 'Low-Medium',
      impact: 'Poor conversion rates and wasted budget',
      mitigation: 'Deploy A/B testing framework from Week 1. Monitor messaging resonance daily.'
    },
    {
      risk: 'Competitive response (price cuts, aggressive marketing)',
      probability: 'Medium',
      impact: 'Reduced differentiation perception',
      mitigation: 'Emphasize unique value props and customer success stories. Maintain messaging refresh cadence.'
    }
  ],
  metrics: {
    awareness: 'Reach and impressions growth week-over-week. Target: 40-50% increase by end of week 2.',
    engagement: 'CTR and content interaction rate. Target: 2-3% CTR, 10-15% social engagement rate.',
    conversion: 'Qualified lead volume and cost per acquisition. Target: 100+ qualified leads at target CPA.',
    retention: 'Lead-to-trial conversion and trial-to-paid rate. Target: 20%+ trial conversion.',
    customKpis: [
      {
        kpi: 'Brand Sentiment',
        target: '70%+ positive mentions in social listening',
        measurableBy: 'Social media monitoring tools'
      },
      {
        kpi: 'Content Performance',
        target: '15%+ engagement rate on organic content',
        measurableBy: 'Channel analytics and tracking'
      }
    ]
  },
  nextStepRecommendations: [
    'Establish daily performance monitoring dashboard with key metrics',
    'Implement A/B testing framework starting Week 1',
    'Plan post-campaign nurture sequence for leads collected',
    'Schedule mid-campaign review meeting at end of Week 2',
    'Begin secondary campaign planning for sustained growth'
  ],
  keyTakeaways: [
    `${input.product} is well-positioned to reach and convert ${input.audience} through integrated ${input.channels.join(' + ')} campaign`,
    'Message-channel fit is critical - test early and optimize daily',
    'Competitive differentiation must be clear and compelling from day one',
    'Success metrics should be tracked real-time with flexibility to optimize',
    'Post-campaign nurture and retention planning essential for long-term value'
  ]
})

export const runManagerAgent = async ({ input, researchOutput, competitorIntelligenceOutput, copywriterOutput, artDirectorOutput, aiClient }) => {
  const systemPrompt = `You MUST return ONLY valid JSON with NO markdown, NO explanation. Start with {, end with }.

You are a campaign manager. Return JSON with these EXACT fields (all required):
- projectTitle (string)
- generatedDate (string: YYYY-MM-DD)
- overview (string)
- objectives (array of 3+ strings)
- targetAudience (object with: primary, secondary, demographics, painPoints array, psychographics, behavioralPatterns array)
- keyMessages (array of 3+ strings)
- adCopy (object with: headline, subheadline, bodyPrimary, bodySocial, cta)
- creativeDirection (object with: visualTheme, colorPalette object with primary/secondary/accent/success, imagery array of 3+ strings, designStyle)
- channels (array of objects with: name, budget, goal, creative, expectedReach optional, placements optional)
- metrics (object with: awareness, engagement, conversion, retention, customKpis array optional)
- nextStepRecommendations (array of strings)
- keyTakeaways (array of strings)
- marketContext optional (object with: marketSize, growthTrend, keyIndustryInsights array)
- competitiveAnalysis optional (object with: differentiation, opportunities array, riskFlags array, topCompetitors array)`

  const userPrompt = `Input: ${JSON.stringify(input)}
Research: ${JSON.stringify(researchOutput)}
Competitors: ${JSON.stringify(competitorIntelligenceOutput)}
Copy: ${JSON.stringify(copywriterOutput)}
Design: ${JSON.stringify(artDirectorOutput)}

Return ONLY JSON object matching schema. ALL fields MUST be properly typed.`

  console.log('[ManagerAgent] Synthesizing all agent outputs into final brief...')
  const response = await aiClient.generateJson({
    systemPrompt,
    userPrompt,
    temperature: 0.4
  })

  if (!response.ok) {
    console.log(`[ManagerAgent] AI synthesis failed (reason: ${response.reason}), using fallback`)
    return {
      output: buildFallbackBrief({
        input,
        research: researchOutput,
        copy: copywriterOutput,
        art: artDirectorOutput,
        competitiveIntel: competitorIntelligenceOutput
      }),
      source: 'fallback',
      reason: response.reason
    }
  }

  console.log('[ManagerAgent] Validating synthesized brief against schema...')
  const parsed = finalBriefSchema.safeParse(response.data)
  if (!parsed.success) {
    console.error('[ManagerAgent] Schema validation failed:', parsed.error.issues.slice(0, 3))
    return {
      output: buildFallbackBrief({
        input,
        research: researchOutput,
        copy: copywriterOutput,
        art: artDirectorOutput,
        competitiveIntel: competitorIntelligenceOutput
      }),
      source: 'fallback',
      reason: 'invalid_schema'
    }
  }

  console.log('[ManagerAgent] Successfully generated and validated final brief from AI')
  return {
    output: parsed.data,
    source: 'provider',
    reason: null
  }
}
