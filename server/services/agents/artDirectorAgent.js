const fallbackArt = (input) => ({
  visualTheme: `${input.tone || 'Modern'} growth command center`,
  colorPalette: ['#00D9FF', '#B537F2', '#FF2E97', '#00FF94'],
  creativePrompts: [
    `Design a hero visual that communicates trust and speed for ${input.product}.`,
    `Show collaboration and outcomes relevant to ${input.audience}.`,
    `Create channel-native variants for ${input.channels.join(', ')}.`
  ],
  styleGuide: 'Dark glassmorphism with neon accents and rounded cards.'
})

export const runArtDirectorAgent = async ({ input, researchOutput, copywriterOutput, aiClient }) => {
  const systemPrompt = `You are an AI art director specializing in campaign creative systems. Your response MUST be ONLY valid JSON, with NO other text, NO markdown, NO explanation.
Return this exact JSON structure:
{
  "visualTheme": "string",
  "colorPalette": ["#HEX", "#HEX", "#HEX", "#HEX"],
  "creativePrompts": ["string", "string", "string"],
  "styleGuide": "string"
}`

  const userPrompt = `Campaign: ${JSON.stringify(input)}
Research: ${JSON.stringify(researchOutput)}
Copy: ${JSON.stringify(copywriterOutput)}

Return ONLY the JSON object, nothing else.`

  console.log('[ArtDirectorAgent] Creating visual direction...')
  const response = await aiClient.generateJson({
    systemPrompt,
    userPrompt,
    temperature: 0.5
  })

  if (!response.ok) {
    console.log(`[ArtDirectorAgent] Using fallback (reason: ${response.reason})`)
    return {
      output: fallbackArt(input),
      source: 'fallback',
      reason: response.reason
    }
  }

  console.log('[ArtDirectorAgent] Successfully generated art direction from AI')
  return {
    output: response.data,
    source: 'provider',
    reason: null
  }
}
