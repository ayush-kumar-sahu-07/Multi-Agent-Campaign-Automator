import { createAiClient } from './aiClient.js'
import { finalBriefSchema } from '../schemas/briefSchema.js'
import { runResearchAgent } from './agents/researchAgent.js'
import { runCopywriterAgent } from './agents/copywriterAgent.js'
import { runArtDirectorAgent } from './agents/artDirectorAgent.js'
import { runCompetitorIntelligenceAgent } from './agents/competitorIntelligenceAgent.js'
import { runManagerAgent } from './agents/managerAgent.js'

const baseAgentState = {
  research: { title: 'Research Agent', icon: 'Search', status: 'pending', output: null },
  competitorIntelligence: { title: 'Competitor Intelligence Agent', icon: 'TrendingUp', status: 'pending', output: null },
  copywriter: { title: 'Copywriter Agent', icon: 'PenTool', status: 'pending', output: null },
  artDirector: { title: 'Art Director Agent', icon: 'Palette', status: 'pending', output: null },
  manager: { title: 'Manager Agent', icon: 'Briefcase', status: 'pending', output: null }
}

export const runWorkflow = async (input) => {
  const aiClient = createAiClient()
  // Proper boolean: only 'true' explicitly enables fast mode (default is AI mode)
  const fastMode = process.env.AI_FAST_MODE?.toLowerCase() === 'true'
  const agents = structuredClone(baseAgentState)

  console.log(`[Workflow START] fastMode=${fastMode}, provider=${aiClient.provider}, model=${aiClient.model}`)

  let research
  let competitorIntelligence
  let copywriter
  let artDirector

  if (fastMode) {
    research = {
      output: {
        marketTrends: [
          `${input.product} demand is increasing across digital channels.`,
          `Buyers in ${input.audience} prefer practical ROI-focused messaging.`,
          `${input.channels.join(', ')} remain strong channels for awareness and conversion.`
        ],
        competitors: [
          'Category leaders rely on generic messaging.',
          'Most alternatives underuse creative + channel fit.',
          'There is room for differentiated positioning.'
        ],
        insights: `Position ${input.product} as a fast, measurable win for ${input.audience}.`
      },
      source: 'fallback',
      reason: 'fast_mode'
    }

    competitorIntelligence = {
      output: {
        topCompetitors: [
          {
            name: 'Market Leader',
            positioning: 'Premium enterprise solution',
            messaging: 'ROI and efficiency focused',
            channels: input.channels.slice(0, 3),
            strengths: ['Brand recognition', 'Feature set', 'Market presence']
          }
        ],
        sharedWeaknesses: ['Generic messaging', 'Lack of personality', 'Missing emotional benefits'],
        messagingGaps: ['Speed undervalued', 'Community not emphasized', 'Authenticity gaps'],
        differentiation: `${input.product} stands out with personalized ${input.channels.slice(0, 2).join(' + ')} strategy`,
        riskFlags: ['Market consolidation', 'Price competition', 'Messaging saturation'],
        opportunities: ['Emerging channels', 'Community focus', 'Authentic brand voice']
      },
      source: 'fallback',
      reason: 'fast_mode'
    }

    copywriter = {
      output: {
        headline: `Work smarter with ${input.product}`,
        tagline: `Built for ${input.audience}`,
        adCopy: [
          `${input.product} helps ${input.audience} execute faster with less effort.`,
          `Use ${input.channels.join(', ')} to reach the right people with clear value messaging.`,
          'Launch quickly and scale confidently with a focused creative strategy.'
        ],
        ctaText: 'Start your campaign now'
      },
      source: 'fallback',
      reason: 'fast_mode'
    }

    artDirector = {
      output: {
        visualTheme: `${input.tone || 'Modern'} growth command center`,
        colorPalette: ['#00D9FF', '#B537F2', '#FF2E97', '#00FF94'],
        creativePrompts: [
          `Design a hero visual that communicates trust and speed for ${input.product}.`,
          `Show collaboration and outcomes relevant to ${input.audience}.`,
          `Create channel-native variants for ${input.channels.join(', ')}.`
        ],
        styleGuide: 'High-contrast modern layout with clear hierarchy.'
      },
      source: 'fallback',
      reason: 'fast_mode'
    }

    agents.research.status = 'done'
    agents.research.output = research.output
    agents.competitorIntelligence.status = 'done'
    agents.competitorIntelligence.output = competitorIntelligence.output
    agents.copywriter.status = 'done'
    agents.copywriter.output = copywriter.output
    agents.artDirector.status = 'done'
    agents.artDirector.output = artDirector.output
  } else {
    try {
      agents.research.status = 'running'
      console.log('[Workflow] Running Research Agent...')
      research = await runResearchAgent({ input, aiClient })
      agents.research.status = 'done'
      agents.research.output = research.output
      console.log(`[Workflow] Research Agent ✓ (source: ${research.source})`)
    } catch (error) {
      agents.research.status = 'failed'
      console.error('[Workflow ERROR] Research Agent failed:', error.message, error.stack?.substring(0, 200))
      return { agents, finalBrief: null, meta: { provider: aiClient.provider, model: aiClient.model, error: 'research_agent_failed', detail: error.message } }
    }

    agents.competitorIntelligence.status = 'running'
    agents.copywriter.status = 'running'
    agents.artDirector.status = 'running'

    try {
      console.log('[Workflow] Running parallel agents (Competitor Intelligence, Copywriter, Art Director)...')
      const competitorIntelligencePromise = runCompetitorIntelligenceAgent({
        input,
        researchOutput: research.output,
        aiClient
      })

      const copywriterPromise = runCopywriterAgent({
        input,
        researchOutput: research.output,
        aiClient
      })

      const artDirectorPromise = runArtDirectorAgent({
        input,
        researchOutput: research.output,
        aiClient
      })

      ;[competitorIntelligence, copywriter, artDirector] = await Promise.all([
        competitorIntelligencePromise,
        copywriterPromise,
        artDirectorPromise
      ])

      agents.competitorIntelligence.status = 'done'
      agents.competitorIntelligence.output = competitorIntelligence.output
      agents.copywriter.status = 'done'
      agents.copywriter.output = copywriter.output
      agents.artDirector.status = 'done'
      agents.artDirector.output = artDirector.output
      console.log('[Workflow] Parallel agents ✓ (CI: ' + competitorIntelligence.source + ', Copy: ' + copywriter.source + ', Art: ' + artDirector.source + ')')
    } catch (error) {
      console.error('[Workflow ERROR] Parallel agents failed:', error.message, error.stack?.substring(0, 200))
      return { agents, finalBrief: null, meta: { provider: aiClient.provider, model: aiClient.model, error: 'parallel_agents_failed', detail: error.message } }
    }
  }

  agents.manager.status = 'running'
  let manager
  try {
    console.log('[Workflow] Running Manager Agent (synthesis)...')
    manager = await runManagerAgent({
      input,
      researchOutput: research.output,
      competitorIntelligenceOutput: competitorIntelligence.output,
      copywriterOutput: copywriter.output,
      artDirectorOutput: artDirector.output,
      aiClient
    })
    agents.manager.output = manager.output
    agents.manager.status = 'done'
    console.log(`[Workflow] Manager Agent ✓ (source: ${manager.source})`)
  } catch (error) {
    agents.manager.status = 'failed'
    console.error('[Workflow ERROR] Manager Agent failed:', error.message, error.stack?.substring(0, 200))
    return { agents, finalBrief: null, meta: { provider: aiClient.provider, model: aiClient.model, error: 'manager_agent_failed', detail: error.message } }
  }

  const parse = finalBriefSchema.safeParse(manager.output)
  if (!parse.success) {
    agents.manager.status = 'failed'
    const firstIssues = parse.error.issues.slice(0, 5).map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
    console.error('[Workflow ERROR] Brief validation failed:', firstIssues)
    return {
      agents,
      finalBrief: null,
      meta: {
        provider: aiClient.provider,
        model: aiClient.model,
        validationError: parse.error.issues
      }
    }
  }

  agents.manager.status = 'done'

  console.log('[Workflow SUCCESS] All agents completed, brief validated')
  return {
    agents,
    finalBrief: parse.data,
    meta: {
      provider: aiClient.provider,
      model: aiClient.model,
      fastMode,
      sources: {
        research: research.source,
        competitorIntelligence: competitorIntelligence.source,
        copywriter: copywriter.source,
        artDirector: artDirector.source,
        manager: manager.source
      }
    }
  }
}
