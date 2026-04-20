const fallbackCompetitorIntelligence = (input) => ({
  topCompetitors: [
    {
      name: 'Industry Leader A',
      positioning: 'Premium positioning with emphasis on enterprise features',
      messaging: 'ROI-focused, emphasizes time-savings and automation',
      channels: input.channels.slice(0, 3),
      strengths: ['Strong brand recognition', 'Wide feature set', 'Established community']
    },
    {
      name: 'Emerging Competitor B',
      positioning: 'Agile, startup-friendly alternative',
      messaging: 'Accessibility and ease of use with personality-driven tone',
      channels: input.channels.slice(0, 2),
      strengths: ['Modern design', 'Viral marketing', 'Product virality']
    },
    {
      name: 'Traditional Alternative C',
      positioning: 'Conservative, enterprise-grade solution',
      messaging: 'Security, compliance, and institutional trust',
      channels: ['LinkedIn', 'Email', 'Industry Events'],
      strengths: ['Established relationships', 'Regulatory compliance', 'Support services']
    }
  ],
  sharedWeaknesses: [
    'Most competitors use generic industry terminology',
    'Lack of personality and authentic brand voice',
    'Insufficient focus on measurable outcomes'
  ],
  messagingGaps: [
    `${input.audience} value speed and efficiency more than competitors acknowledge`,
    'Emotional benefits (confidence, peace of mind) are underutilized',
    'Social proof and community aspects are missing from most competitor campaigns'
  ],
  differentiation: `${input.product} can dominate by combining ${input.channels.slice(0, 2).join(' + ')} strategies with authentic, outcome-focused messaging that resonates specifically with ${input.audience}.`,
  riskFlags: [
    'Market is consolidating around 2-3 major players; differentiation is critical',
    'Pricing pressure from free/freemium alternatives',
    'Messaging saturation in ROI and efficiency angles'
  ],
  opportunities: [
    `Tap emerging channels not yet saturated by competitors`,
    `Build community-driven positioning vs. feature-driven`,
    `Emphasize ${input.tone || 'authentic'} brand voice as differentiator`
  ]
})

export const runCompetitorIntelligenceAgent = async ({ input, researchOutput, aiClient }) => {
  const systemPrompt = `You are a competitive intelligence strategist and market analyst. Your response MUST be ONLY valid JSON, with NO other text, NO markdown, NO explanation.
Return this exact JSON structure:
{
  "topCompetitors": [{"name": "string", "positioning": "string", "messaging": "string", "channels": ["string"], "strengths": ["string"]}],
  "sharedWeaknesses": ["string", "string", "string"],
  "messagingGaps": ["string", "string", "string"],
  "differentiation": "string",
  "riskFlags": ["string", "string", "string"],
  "opportunities": ["string", "string", "string"]
}`

  const userPrompt = `Campaign: ${JSON.stringify(input)}
Research: ${JSON.stringify(researchOutput)}

Return ONLY the JSON object, nothing else.`

  console.log('[CompetitorIntelligenceAgent] Analyzing competitive landscape...')
  const response = await aiClient.generateJson({
    systemPrompt,
    userPrompt,
    temperature: 0.4
  })

  if (!response.ok) {
    console.log(`[CompetitorIntelligenceAgent] Using fallback (reason: ${response.reason})`)
    return {
      output: fallbackCompetitorIntelligence(input),
      source: 'fallback',
      reason: response.reason
    }
  }

  console.log('[CompetitorIntelligenceAgent] Successfully analyzed competition from AI')
  return {
    output: response.data,
    source: 'provider',
    reason: null
  }
}
