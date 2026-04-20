const fallbackCopywriter = (input) => ({
  headline: `Work smarter with ${input.product}`,
  tagline: `Built for ${input.audience}`,
  adCopy: [
    `${input.product} helps ${input.audience} execute faster with less effort.`,
    `Use ${input.channels.join(', ')} to reach the right people with clear value messaging.`,
    `Launch quickly and scale confidently with a focused creative strategy.`
  ],
  ctaText: 'Start your campaign now'
})

export const runCopywriterAgent = async ({ input, researchOutput, aiClient }) => {
  const systemPrompt = `You are an expert direct-response copywriter. Your response MUST be ONLY valid JSON, with NO other text, NO markdown, NO explanation.
Return this exact JSON structure:
{
  "headline": "string",
  "tagline": "string",
  "adCopy": ["string", "string", "string"],
  "ctaText": "string"
}`

  const userPrompt = `Campaign: ${JSON.stringify(input)}
Research: ${JSON.stringify(researchOutput)}

Return ONLY the JSON object, nothing else.`

  console.log('[CopywriterAgent] Generating copy...')
  const response = await aiClient.generateJson({
    systemPrompt,
    userPrompt,
    temperature: 0.6
  })

  if (!response.ok) {
    console.log(`[CopywriterAgent] Using fallback (reason: ${response.reason})`)
    return {
      output: fallbackCopywriter(input),
      source: 'fallback',
      reason: response.reason
    }
  }

  console.log('[CopywriterAgent] Successfully generated copy from AI')
  return {
    output: response.data,
    source: 'provider',
    reason: null
  }
}
