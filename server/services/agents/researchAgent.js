const fallbackResearch = (input) => ({
  marketTrends: [
    `${input.product} demand is increasing across digital channels.`,
    `Buyers in ${input.audience} prefer practical ROI-focused messaging.`,
    `${input.channels.join(', ')} remain strong channels for awareness and conversion.`
  ],
  competitors: [
    'Category leaders rely on single-channel campaigns and generic copy.',
    'Most alternatives are either too technical or too shallow for modern teams.',
    'There is room for better creative + automation alignment.'
  ],
  insights: `Position ${input.product} as a fast, measurable win for ${input.audience}.`
})

export const runResearchAgent = async ({ input, aiClient }) => {
  const systemPrompt = `You are a senior market research analyst. Your response MUST be ONLY valid JSON, with NO other text, NO markdown, NO explanation.
Return this exact JSON structure:
{
  "marketTrends": ["string", "string", "string"],
  "competitors": ["string", "string", "string"],
  "insights": "string"
}`

  const userPrompt = `${JSON.stringify(input)}

Return ONLY the JSON object, nothing else.`

  console.log('[ResearchAgent] Starting research analysis...')
  const response = await aiClient.generateJson({
    systemPrompt,
    userPrompt,
    temperature: 0.3
  })

  if (!response.ok) {
    console.log(`[ResearchAgent] Using fallback (reason: ${response.reason})`)
    return {
      output: fallbackResearch(input),
      source: 'fallback',
      reason: response.reason
    }
  }

  console.log('[ResearchAgent] Successfully generated research from AI')
  return {
    output: response.data,
    source: 'provider',
    reason: null
  }
}
