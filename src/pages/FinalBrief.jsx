import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import { Download, Copy, CheckCircle, FileText, Target, Users, Palette, Calendar, TrendingUp, AlertTriangle, Lightbulb, BarChart3, Clock, ArrowRight, Zap, Shield } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import { useWorkflow } from '../context/WorkflowContext'

const FinalBrief = () => {
  const navigate = useNavigate()
  const { finalBrief, meta } = useWorkflow()
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState('')

  if (!finalBrief) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Card variant="glass" className="text-center border border-yellow-300/40">
          <AlertTriangle className="w-10 h-10 mx-auto text-yellow-300 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">No Brief Available</h1>
          <p className="text-gray-400 mb-6">
            Run the workflow first to generate a project-specific brief.
          </p>
          <Button onClick={() => navigate('/create')}>Create Campaign</Button>
        </Card>
      </div>
    )
  }

  const handleCopy = async () => {
    try {
      const briefText = JSON.stringify(finalBrief, null, 2)
      await navigator.clipboard.writeText(briefText)
      setCopyError('')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyError('Clipboard permission denied. Use download instead.')
    }
  }

  const handleDownload = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 48
    const contentWidth = pageWidth - margin * 2
    let y = margin

    const addLine = (text = '', fontSize = 11, spacing = 16) => {
      if (y > pageHeight - margin) {
        doc.addPage()
        y = margin
      }

      doc.setFontSize(fontSize)
      const lines = doc.splitTextToSize(String(text), contentWidth)
      lines.forEach((line) => {
        if (y > pageHeight - margin) {
          doc.addPage()
          y = margin
        }
        doc.text(line, margin, y)
        y += spacing
      })
    }

    const addHeading = (text) => {
      y += 8
      addLine(text, 18, 22)
      y += 6
    }

    const addSubheading = (text) => {
      addLine(text, 13, 18)
    }

    const addSectionDivider = () => {
      y += 10
    }

    // Title Page
    addLine(finalBrief.projectTitle, 28, 40)
    addLine(`Campaign Marketing Brief`, 14, 20)
    addLine(`Generated on ${finalBrief.generatedDate}`, 10, 16)
    addLine(`Provider: ${meta?.provider || 'N/A'} | Model: ${meta?.model || 'N/A'}`, 9, 14)
    y += 16

    // Executive Summary
    if (finalBrief.executiveSummary) {
      addHeading('Executive Summary')
      addLine(finalBrief.executiveSummary, 11, 16)
      addSectionDivider()
    }

    // Overview
    addHeading('Campaign Overview')
    addLine(finalBrief.overview, 11, 16)
    addSectionDivider()

    // Market Context
    if (finalBrief.marketContext) {
      addHeading('Market Context')
      addSubheading('Market Size')
      addLine(finalBrief.marketContext.marketSize, 11, 14)
      addSubheading('Growth Trend')
      addLine(finalBrief.marketContext.growthTrend, 11, 14)
      if (finalBrief.marketContext.keyIndustryInsights?.length) {
        addSubheading('Key Industry Insights')
        finalBrief.marketContext.keyIndustryInsights.forEach((insight) => {
          addLine(`• ${insight}`, 11, 14)
        })
      }
      addSectionDivider()
    }

    // Campaign Objectives
    addHeading('Campaign Objectives')
    finalBrief.objectives.forEach((objective, idx) => addLine(`${idx + 1}. ${objective}`, 11, 16))
    addSectionDivider()

    // Target Audience
    addHeading('Target Audience')
    addSubheading('Primary Audience')
    addLine(finalBrief.targetAudience.primary, 11, 14)
    addSubheading('Secondary Audience')
    addLine(finalBrief.targetAudience.secondary, 11, 14)
    addSubheading('Demographics')
    addLine(finalBrief.targetAudience.demographics, 11, 14)
    if (finalBrief.targetAudience.psychographics) {
      addSubheading('Psychographics')
      addLine(finalBrief.targetAudience.psychographics, 11, 14)
    }
    addSubheading('Pain Points')
    finalBrief.targetAudience.painPoints.forEach((pain) => addLine(`• ${pain}`, 11, 14))
    addSectionDivider()

    // Audience Segmentation
    if (finalBrief.audienceSegmentation?.length) {
      addHeading('Audience Segmentation')
      finalBrief.audienceSegmentation.forEach((segment) => {
        addSubheading(segment.segment)
        addLine(`Characteristics: ${segment.characteristics}`, 10, 12)
        addLine(`Need State: ${segment.needState}`, 10, 12)
        addLine(`Preferred Channels: ${segment.preferredChannels.join(', ')}`, 10, 12)
        y += 6
      })
      addSectionDivider()
    }

    // Key Messages & Messaging Pillars
    addHeading('Key Messages')
    finalBrief.keyMessages.forEach((message) => addLine(`• ${message}`, 11, 16))
    addSectionDivider()

    if (finalBrief.messagingPillars?.length) {
      addHeading('Messaging Pillars')
      finalBrief.messagingPillars.forEach((pillar) => {
        addSubheading(pillar.pillar)
        addLine(`Message: ${pillar.supportingMessage}`, 10, 12)
        addLine(`Proof: ${pillar.proof}`, 10, 12)
        y += 6
      })
      addSectionDivider()
    }

    // Competitive Analysis
    if (finalBrief.competitiveAnalysis) {
      addHeading('Competitive Analysis & Strategy')
      addSubheading('Differentiation')
      addLine(finalBrief.competitiveAnalysis.differentiation, 11, 14)
      addSubheading('Market Opportunities')
      finalBrief.competitiveAnalysis.opportunities.forEach((opp) => addLine(`• ${opp}`, 11, 14))
      addSubheading('Risk Flags')
      finalBrief.competitiveAnalysis.riskFlags.forEach((risk) => addLine(`• ${risk}`, 11, 14))
      addSectionDivider()
    }

    // Channel Strategy
    if (finalBrief.channelStrategy) {
      addHeading('Channel Strategy')
      addSubheading('Primary Channel')
      addLine(finalBrief.channelStrategy.primaryChannel, 11, 14)
      addSubheading('Secondary Channels')
      addLine(finalBrief.channelStrategy.secondaryChannels.join(', '), 11, 14)
      addSubheading('Channel Rationale')
      addLine(finalBrief.channelStrategy.channelRationale, 11, 14)
      addSectionDivider()
    }

    // Content Recommendations
    if (finalBrief.contentRecommendations?.length) {
      addHeading('Content Recommendations')
      finalBrief.contentRecommendations.forEach((rec) => {
        addLine(`${rec.type} - ${rec.topic}`, 11, 14)
        addLine(`  Format: ${rec.format} | Frequency: ${rec.frequency}`, 10, 12)
        y += 4
      })
      addSectionDivider()
    }

    // Ad Copy
    addHeading('Ad Copy')
    addSubheading('Headline')
    addLine(finalBrief.adCopy.headline, 13, 16)
    addSubheading('Subheadline')
    addLine(finalBrief.adCopy.subheadline, 11, 14)
    addSubheading('Body Copy')
    addLine(finalBrief.adCopy.bodyPrimary, 11, 14)
    addSubheading('Social Media Copy')
    addLine(finalBrief.adCopy.bodySocial, 11, 14)
    addSubheading('Call to Action')
    addLine(finalBrief.adCopy.cta, 12, 16)
    addSectionDivider()

    // Creative Direction
    addHeading('Creative Direction')
    addSubheading('Visual Theme')
    addLine(finalBrief.creativeDirection.visualTheme, 11, 14)
    addSubheading('Color Palette')
    Object.entries(finalBrief.creativeDirection.colorPalette).forEach(([name, color]) => {
      addLine(`${name}: ${color}`, 10, 12)
    })
    addSubheading('Design Style')
    addLine(finalBrief.creativeDirection.designStyle, 11, 14)
    addSubheading('Imagery Guidelines')
    finalBrief.creativeDirection.imagery.forEach((img) => addLine(`• ${img}`, 11, 14))
    addSectionDivider()

    // Marketing Channels
    addHeading('Marketing Channels')
    finalBrief.channels.forEach((channel) => {
      addSubheading(channel.name)
      addLine(`Budget: ${channel.budget}`, 10, 12)
      addLine(`Goal: ${channel.goal}`, 10, 12)
      addLine(`Creative: ${channel.creative}`, 10, 12)
      if (channel.expectedReach) {
        addLine(`Expected Reach: ${channel.expectedReach}`, 10, 12)
      }
      y += 6
    })
    addSectionDivider()

    // Budget Suggestions
    if (finalBrief.budgetSuggestions) {
      addHeading('Budget Recommendations')
      if (finalBrief.budgetSuggestions.totalBudget) {
        addSubheading('Total Budget')
        addLine(finalBrief.budgetSuggestions.totalBudget, 11, 14)
      }
      if (finalBrief.budgetSuggestions.allocation?.length) {
        addSubheading('Allocation by Channel')
        finalBrief.budgetSuggestions.allocation.forEach((alloc) => {
          addLine(`${alloc.channel}: ${alloc.amount}`, 10, 12)
          addLine(`  Rationale: ${alloc.rationale}`, 10, 12)
        })
      }
      if (finalBrief.budgetSuggestions.contingency) {
        addLine(`Contingency: ${finalBrief.budgetSuggestions.contingency}`, 11, 14)
      }
      addSectionDivider()
    }

    // Posting Plan
    addHeading('4-Week Posting Plan')
    Object.entries(finalBrief.postingPlan).forEach(([week, plan]) => {
      addSubheading(week.replace('week', 'Week '))
      addLine(plan, 11, 14)
      y += 4
    })
    addSectionDivider()

    // Campaign Timeline
    if (finalBrief.campaignTimeline?.keyDates?.length) {
      addHeading('Campaign Timeline & Milestones')
      finalBrief.campaignTimeline.keyDates.forEach((date) => {
        addLine(`${date.date} - ${date.milestone}`, 11, 14)
        addLine(`  Deliverable: ${date.deliverable}`, 10, 12)
        y += 4
      })
      addSectionDivider()
    }

    // Risk Analysis
    if (finalBrief.riskAnalysis?.length) {
      addHeading('Risk Analysis & Mitigation')
      finalBrief.riskAnalysis.forEach((risk) => {
        addLine(`Risk: ${risk.risk}`, 11, 14)
        addLine(`  Probability: ${risk.probability} | Impact: ${risk.impact}`, 10, 12)
        addLine(`  Mitigation: ${risk.mitigation}`, 10, 12)
        y += 6
      })
      addSectionDivider()
    }

    // Success Metrics
    addHeading('Success Metrics & KPIs')
    Object.entries(finalBrief.metrics).forEach(([metric, value]) => {
      if (metric !== 'customKpis') {
        addLine(`${metric.charAt(0).toUpperCase() + metric.slice(1)}: ${value}`, 10, 14)
      }
    })
    if (finalBrief.metrics.customKpis?.length) {
      addSubheading('Custom KPIs')
      finalBrief.metrics.customKpis.forEach((kpi) => {
        addLine(`${kpi.kpi}: Target ${kpi.target}`, 10, 12)
        addLine(`  Measured by: ${kpi.measurableBy}`, 9, 11)
      })
    }
    addSectionDivider()

    // Next Steps
    if (finalBrief.nextStepRecommendations?.length) {
      addHeading('Next Step Recommendations')
      finalBrief.nextStepRecommendations.forEach((step) => {
        addLine(`• ${step}`, 11, 14)
      })
      addSectionDivider()
    }

    // Key Takeaways
    if (finalBrief.keyTakeaways?.length) {
      addHeading('Key Takeaways')
      finalBrief.keyTakeaways.forEach((takeaway) => {
        addLine(`• ${takeaway}`, 11, 14)
      })
    }

    doc.save(`${finalBrief.projectTitle.replace(/\s+/g, '-').toLowerCase()}-brief.pdf`)
  }

  const Section = ({ icon: Icon, title, variant = 'default', children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`${variant === 'highlight' ? 'bg-gradient-to-r from-neon-pink to-neon-blue' : 'bg-gradient-to-r from-neon-blue to-neon-purple'} p-2.5 rounded-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
      </div>
      <div className="ml-0 sm:ml-12">
        {children}
      </div>
    </motion.div>
  )

  const MetricCard = ({ label, value }) => (
    <Card variant="glassDark" className="text-center hover:border-neon-blue/60 transition-colors">
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">{label}</p>
      <p className="text-sm text-gray-300">{value}</p>
    </Card>
  )

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-neon-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
            <CheckCircle className="w-4 h-4 text-neon-green" />
            <span className="text-sm font-medium text-gray-300">Generated Successfully</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4">
            <span className="text-gradient">{finalBrief.projectTitle}</span>
          </h1>
          <p className="text-xl text-gray-400 mb-2">Campaign Marketing Brief</p>
          <p className="text-sm text-gray-500">
            Generated on {finalBrief.generatedDate} • {meta?.provider || 'AI'} {meta?.model ? `(${meta.model})` : ''}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button size="lg" onClick={handleDownload} className="w-full sm:w-auto">
            <Download className="w-5 h-5" />
            Download as PDF
          </Button>
          <Button variant="secondary" size="lg" onClick={handleCopy} className="w-full sm:w-auto">
            {copied ? (
              <>
                <CheckCircle className="w-5 h-5 text-neon-green" />
                Copied to Clipboard
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy JSON
              </>
            )}
          </Button>
        </motion.div>

        {copyError && <p className="text-center text-red-400 text-sm mb-4">{copyError}</p>}

        {/* Main Brief Card */}
        <Card variant="glass" className="border-2 border-neon-blue/30 shadow-glow mb-12">
          <div className="space-y-12">
            {/* Title & Meta */}
            <div className="border-b border-white/10 pb-8">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl sm:text-4xl font-bold text-white mb-3"
              >
                {finalBrief.projectTitle}
              </motion.h1>
              <p className="text-gray-400 text-sm">
                Generated {finalBrief.generatedDate}
              </p>
            </div>

            {/* Executive Summary */}
            {finalBrief.executiveSummary && (
              <Section icon={Lightbulb} title="Executive Summary" variant="highlight">
                <div className="glass-dark rounded-xl p-6 border-l-4 border-neon-pink">
                  <p className="text-gray-300 leading-relaxed text-lg">{finalBrief.executiveSummary}</p>
                </div>
              </Section>
            )}

            {/* Overview */}
            <Section icon={FileText} title="Overview">
              <p className="text-gray-300 leading-relaxed text-lg">{finalBrief.overview}</p>
            </Section>

            {/* Market Context */}
            {finalBrief.marketContext && (
              <Section icon={TrendingUp} title="Market Context">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-neon-blue mb-2 uppercase">Market Size</h3>
                    <p className="text-gray-300">{finalBrief.marketContext.marketSize}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neon-blue mb-2 uppercase">Growth Trend</h3>
                    <p className="text-gray-300">{finalBrief.marketContext.growthTrend}</p>
                  </div>
                  {finalBrief.marketContext.keyIndustryInsights?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-neon-blue mb-3 uppercase">Key Insights</h3>
                      <ul className="space-y-2">
                        {finalBrief.marketContext.keyIndustryInsights.map((insight, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-300">
                            <Zap className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Campaign Objectives */}
            <Section icon={Target} title="Campaign Objectives">
              <div className="space-y-3">
                {finalBrief.objectives.map((obj, i) => (
                  <div key={i} className="glass-dark rounded-lg p-4 border-l-4 border-neon-blue flex items-start gap-4">
                    <div className="text-neon-blue font-bold flex-shrink-0 bg-neon-blue/20 rounded-full w-8 h-8 flex items-center justify-center">
                      {i + 1}
                    </div>
                    <p className="text-gray-300 flex-1">{obj}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Target Audience */}
            <Section icon={Users} title="Target Audience">
              <div className="space-y-4">
                <div className="glass-dark rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-neon-blue mb-2">Primary Audience</h4>
                  <p className="text-gray-300">{finalBrief.targetAudience.primary}</p>
                </div>
                <div className="glass-dark rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-neon-blue mb-2">Secondary Audience</h4>
                  <p className="text-gray-300">{finalBrief.targetAudience.secondary}</p>
                </div>
                <div className="glass-dark rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-neon-blue mb-2">Demographics</h4>
                  <p className="text-gray-300">{finalBrief.targetAudience.demographics}</p>
                </div>
                {finalBrief.targetAudience.psychographics && (
                  <div className="glass-dark rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-neon-blue mb-2">Psychographics</h4>
                    <p className="text-gray-300">{finalBrief.targetAudience.psychographics}</p>
                  </div>
                )}
                {finalBrief.targetAudience.behavioralPatterns?.length > 0 && (
                  <div className="glass-dark rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-neon-blue mb-3">Behavioral Patterns</h4>
                    <ul className="space-y-2">
                      {finalBrief.targetAudience.behavioralPatterns.map((pattern, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                          <div className="w-1.5 h-1.5 bg-neon-purple rounded-full mt-2 flex-shrink-0" />
                          {pattern}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="glass-dark rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-neon-blue mb-3">Pain Points</h4>
                  <ul className="space-y-2">
                    {finalBrief.targetAudience.painPoints.map((pain, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300">
                        <AlertTriangle className="w-4 h-4 text-neon-pink flex-shrink-0 mt-0.5" />
                        {pain}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            {/* Audience Segmentation */}
            {finalBrief.audienceSegmentation?.length > 0 && (
              <Section icon={Users} title="Audience Segmentation">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {finalBrief.audienceSegmentation.map((segment, i) => (
                    <Card key={i} variant="glassDark">
                      <h3 className="text-lg font-bold text-white mb-4">{segment.segment}</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-neon-blue font-semibold mb-1">Characteristics</p>
                          <p className="text-gray-300">{segment.characteristics}</p>
                        </div>
                        <div>
                          <p className="text-neon-blue font-semibold mb-1">Need State</p>
                          <p className="text-gray-300">{segment.needState}</p>
                        </div>
                        <div>
                          <p className="text-neon-blue font-semibold mb-1">Preferred Channels</p>
                          <p className="text-gray-300">{segment.preferredChannels.join(', ')}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Section>
            )}

            {/* Key Messages */}
            <Section icon={Target} title="Key Messages">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {finalBrief.keyMessages.map((msg, i) => (
                  <Card key={i} variant="glassDark" className="border-l-4 border-neon-blue">
                    <div className="flex items-start gap-3">
                      <div className="text-lg font-bold text-neon-blue flex-shrink-0">0{i + 1}</div>
                      <p className="text-sm text-gray-300 flex-1">{msg}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </Section>

            {/* Messaging Pillars */}
            {finalBrief.messagingPillars?.length > 0 && (
              <Section icon={Lightbulb} title="Messaging Pillars">
                <div className="space-y-4">
                  {finalBrief.messagingPillars.map((pillar, i) => (
                    <div key={i} className="glass-dark rounded-lg p-4 border-t-2 border-neon-pink">
                      <h4 className="text-lg font-bold text-white mb-2">{pillar.pillar}</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-neon-green font-semibold">Message</p>
                          <p className="text-gray-300">{pillar.supportingMessage}</p>
                        </div>
                        <div>
                          <p className="text-neon-green font-semibold">Proof</p>
                          <p className="text-gray-300">{pillar.proof}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Competitive Analysis */}
            {finalBrief.competitiveAnalysis && (
              <Section icon={Shield} title="Competitive Analysis">
                <div className="space-y-4">
                  <div className="glass-dark rounded-lg p-4 border-l-4 border-neon-blue">
                    <h4 className="text-sm font-semibold text-neon-blue mb-2 uppercase">Differentiation</h4>
                    <p className="text-gray-300">{finalBrief.competitiveAnalysis.differentiation}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-dark rounded-lg p-4 border-t-2 border-neon-green">
                      <h4 className="text-sm font-semibold text-neon-green mb-3 uppercase">Opportunities</h4>
                      <ul className="space-y-2">
                        {finalBrief.competitiveAnalysis.opportunities.map((opp, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                            <ArrowRight className="w-4 h-4 text-neon-green flex-shrink-0 mt-0.5" />
                            {opp}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glass-dark rounded-lg p-4 border-t-2 border-neon-pink">
                      <h4 className="text-sm font-semibold text-neon-pink mb-3 uppercase">Risk Flags</h4>
                      <ul className="space-y-2">
                        {finalBrief.competitiveAnalysis.riskFlags.map((risk, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                            <AlertTriangle className="w-4 h-4 text-neon-pink flex-shrink-0 mt-0.5" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* Channel Strategy */}
            {finalBrief.channelStrategy && (
              <Section icon={TrendingUp} title="Channel Strategy">
                <div className="space-y-4">
                  <div className="glass-dark rounded-lg p-4 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20">
                    <h4 className="text-sm font-semibold text-neon-blue mb-2">Primary Channel</h4>
                    <p className="text-gray-300 text-lg font-semibold">{finalBrief.channelStrategy.primaryChannel}</p>
                  </div>
                  <div className="glass-dark rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-neon-blue mb-2">Secondary Channels</h4>
                    <p className="text-gray-300">{finalBrief.channelStrategy.secondaryChannels.join(', ')}</p>
                  </div>
                  <div className="glass-dark rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-neon-blue mb-2">Channel Rationale</h4>
                    <p className="text-gray-300">{finalBrief.channelStrategy.channelRationale}</p>
                  </div>
                  <div className="glass-dark rounded-lg p-4 border-l-4 border-neon-green">
                    <h4 className="text-sm font-semibold text-neon-green mb-2">Integrated Approach</h4>
                    <p className="text-gray-300">{finalBrief.channelStrategy.integratedApproach}</p>
                  </div>
                </div>
              </Section>
            )}

            {/* Content Recommendations */}
            {finalBrief.contentRecommendations?.length > 0 && (
              <Section icon={FileText} title="Content Recommendations">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {finalBrief.contentRecommendations.map((rec, i) => (
                    <Card key={i} variant="glassDark">
                      <h4 className="text-lg font-bold text-white mb-3">{rec.type}</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-neon-blue font-semibold">Topic</p>
                          <p className="text-gray-300">{rec.topic}</p>
                        </div>
                        <div>
                          <p className="text-neon-blue font-semibold">Format</p>
                          <p className="text-gray-300">{rec.format}</p>
                        </div>
                        <div>
                          <p className="text-neon-blue font-semibold">Frequency</p>
                          <p className="text-gray-300">{rec.frequency}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Section>
            )}

            {/* Ad Copy */}
            <Section icon={FileText} title="Ad Copy">
              <div className="space-y-4">
                <div className="glass-dark rounded-lg p-4 border-l-4 border-neon-purple">
                  <h4 className="text-xs font-semibold text-neon-purple uppercase mb-2">Headline</h4>
                  <p className="text-2xl font-bold text-white">{finalBrief.adCopy.headline}</p>
                </div>
                <div className="glass-dark rounded-lg p-4">
                  <h4 className="text-xs font-semibold text-neon-purple uppercase mb-2">Subheadline</h4>
                  <p className="text-lg text-gray-300">{finalBrief.adCopy.subheadline}</p>
                </div>
                <div className="glass-dark rounded-lg p-4">
                  <h4 className="text-xs font-semibold text-neon-purple uppercase mb-2">Body Copy</h4>
                  <p className="text-gray-300">{finalBrief.adCopy.bodyPrimary}</p>
                </div>
                <div className="glass-dark rounded-lg p-4">
                  <h4 className="text-xs font-semibold text-neon-purple uppercase mb-2">Social Copy</h4>
                  <p className="text-gray-300">{finalBrief.adCopy.bodySocial}</p>
                </div>
                <div className="glass-dark rounded-lg p-4 bg-gradient-to-r from-neon-blue/20 to-neon-pink/20">
                  <h4 className="text-xs font-semibold text-neon-blue uppercase mb-2">Call to Action</h4>
                  <p className="text-xl font-bold text-neon-blue">{finalBrief.adCopy.cta}</p>
                </div>
              </div>
            </Section>

            {/* Creative Direction */}
            <Section icon={Palette} title="Creative Direction">
              <div className="space-y-4">
                <div className="glass-dark rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-neon-blue mb-2 uppercase">Visual Theme</h4>
                  <p className="text-gray-300">{finalBrief.creativeDirection.visualTheme}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neon-blue mb-3 uppercase">Color Palette</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(finalBrief.creativeDirection.colorPalette).map(([name, color]) => (
                      <div key={name} className="glass-dark rounded-lg p-3">
                        <div
                          className="w-full h-16 rounded mb-2 border border-white/10"
                          style={{ backgroundColor: color.split(' ')[0] }}
                        />
                        <p className="text-xs font-semibold text-white capitalize">{name}</p>
                        <p className="text-xs text-gray-500">{color}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-dark rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-neon-blue mb-2 uppercase">Design Style</h4>
                  <p className="text-gray-300">{finalBrief.creativeDirection.designStyle}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neon-blue mb-3 uppercase">Imagery Guidelines</h4>
                  <ul className="space-y-2">
                    {finalBrief.creativeDirection.imagery.map((img, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                        <div className="w-2 h-2 bg-neon-pink rounded-full mt-1.5 flex-shrink-0" />
                        {img}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            {/* Marketing Channels */}
            <Section icon={TrendingUp} title="Marketing Channels">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {finalBrief.channels.map((channel, i) => (
                  <Card key={i} variant="glassDark" className="border-t-2 border-neon-blue">
                    <h4 className="text-lg font-bold text-white mb-4">{channel.name}</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-neon-blue font-semibold">Budget</p>
                        <p className="text-gray-300">{channel.budget}</p>
                      </div>
                      <div>
                        <p className="text-neon-blue font-semibold">Goal</p>
                        <p className="text-gray-300">{channel.goal}</p>
                      </div>
                      <div>
                        <p className="text-neon-blue font-semibold">Creative</p>
                        <p className="text-gray-300">{channel.creative}</p>
                      </div>
                      {channel.expectedReach && (
                        <div>
                          <p className="text-neon-blue font-semibold">Expected Reach</p>
                          <p className="text-gray-300">{channel.expectedReach}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Section>

            {/* Budget Suggestions */}
            {finalBrief.budgetSuggestions && (
              <Section icon={BarChart3} title="Budget Recommendations">
                <div className="space-y-4">
                  {finalBrief.budgetSuggestions.totalBudget && (
                    <div className="glass-dark rounded-lg p-4 bg-gradient-to-r from-neon-green/20 to-neon-blue/20">
                      <h4 className="text-sm font-semibold text-neon-green mb-2 uppercase">Total Budget</h4>
                      <p className="text-2xl font-bold text-white">{finalBrief.budgetSuggestions.totalBudget}</p>
                    </div>
                  )}
                  {finalBrief.budgetSuggestions.allocation?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-neon-blue mb-3 uppercase">Allocation by Channel</h4>
                      <div className="space-y-2">
                        {finalBrief.budgetSuggestions.allocation.map((alloc, i) => (
                          <div key={i} className="glass-dark rounded-lg p-3">
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-semibold text-white">{alloc.channel}</p>
                              <p className="text-neon-purple font-bold">{alloc.amount}</p>
                            </div>
                            <p className="text-xs text-gray-400">Rationale: {alloc.rationale}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {finalBrief.budgetSuggestions.contingency && (
                    <div className="glass-dark rounded-lg p-4 border-l-4 border-neon-yellow">
                      <h4 className="text-sm font-semibold text-yellow-400 mb-1">Contingency</h4>
                      <p className="text-gray-300">{finalBrief.budgetSuggestions.contingency}</p>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* 4-Week Posting Plan */}
            <Section icon={Calendar} title="4-Week Posting Plan">
              <div className="space-y-3">
                {Object.entries(finalBrief.postingPlan).map(([week, plan]) => (
                  <div key={week} className="glass-dark rounded-lg p-4 border-l-4 border-neon-purple">
                    <h4 className="text-sm font-semibold text-neon-purple mb-2 uppercase">
                      {week.replace('week', 'Week ')}
                    </h4>
                    <p className="text-gray-300">{plan}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Campaign Timeline */}
            {finalBrief.campaignTimeline?.keyDates?.length > 0 && (
              <Section icon={Clock} title="Campaign Timeline">
                <div className="space-y-3">
                  {finalBrief.campaignTimeline.keyDates.map((date, i) => (
                    <div key={i} className="glass-dark rounded-lg p-4 border-l-4 border-neon-green">
                      <div className="flex items-start gap-4">
                        <div className="text-neon-green font-bold text-sm shrink-0">{date.date}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-white mb-1">{date.milestone}</p>
                          <p className="text-sm text-gray-400">Deliverable: {date.deliverable}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Risk Analysis */}
            {finalBrief.riskAnalysis?.length > 0 && (
              <Section icon={AlertTriangle} title="Risk Analysis & Mitigation">
                <div className="space-y-3">
                  {finalBrief.riskAnalysis.map((risk, i) => (
                    <div key={i} className="glass-dark rounded-lg p-4 border-l-4 border-neon-pink">
                      <h4 className="text-sm font-semibold text-white mb-2">{risk.risk}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neon-pink">Probability:</span>
                          <span className="text-gray-300">{risk.probability}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neon-pink">Impact:</span>
                          <span className="text-gray-300">{risk.impact}</span>
                        </div>
                        <div>
                          <p className="text-neon-green font-semibold mb-1">Mitigation</p>
                          <p className="text-gray-300">{risk.mitigation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Success Metrics */}
            <Section icon={BarChart3} title="Success Metrics & KPIs">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(finalBrief.metrics).map(([metric, value]) => 
                    metric !== 'customKpis' ? (
                      <MetricCard
                        key={metric}
                        label={metric}
                        value={value}
                      />
                    ) : null
                  )}
                </div>
                {finalBrief.metrics.customKpis?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-neon-blue mb-3 uppercase">Custom KPIs</h4>
                    <div className="space-y-3">
                      {finalBrief.metrics.customKpis.map((kpi, i) => (
                        <div key={i} className="glass-dark rounded-lg p-3">
                          <p className="font-semibold text-white mb-1">{kpi.kpi}</p>
                          <div className="space-y-1 text-sm">
                            <p className="text-neon-green">Target: {kpi.target}</p>
                            <p className="text-gray-400">Measured by: {kpi.measurableBy}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Section>

            {/* Next Steps */}
            {finalBrief.nextStepRecommendations?.length > 0 && (
              <Section icon={ArrowRight} title="Next Step Recommendations">
                <ul className="space-y-2">
                  {finalBrief.nextStepRecommendations.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <ArrowRight className="w-4 h-4 text-neon-green flex-shrink-0 mt-1" />
                      {step}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Key Takeaways */}
            {finalBrief.keyTakeaways?.length > 0 && (
              <Section icon={Zap} title="Key Takeaways">
                <div className="space-y-3">
                  {finalBrief.keyTakeaways.map((takeaway, i) => (
                    <div key={i} className="glass-dark rounded-lg p-4 border-l-4 border-neon-blue flex items-start gap-4">
                      <Zap className="w-5 h-5 text-neon-blue flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">{takeaway}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </Card>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-6">
            Ready to execute? Download your brief and start building momentum.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/create')} variant="secondary">
              Create Another Campaign
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default FinalBrief
