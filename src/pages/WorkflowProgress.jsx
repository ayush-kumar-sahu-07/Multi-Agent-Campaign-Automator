import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react'
import Button from '../components/Button'
import AgentStatus from '../components/AgentStatus'
import Loader from '../components/Loader'
import { useWorkflow } from '../context/WorkflowContext'

const WorkflowProgress = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    campaignInput,
    agents,
    finalBrief,
    meta,
    isRunning,
    error,
    runWorkflow
  } = useWorkflow()

  const [expandedAgent, setExpandedAgent] = useState(null)

  const payload = location.state || campaignInput

  useEffect(() => {
    if (!payload?.product || !payload?.audience || !payload?.channels?.length) {
      navigate('/create')
      return
    }

    if (!finalBrief && !isRunning) {
      runWorkflow(payload).catch(() => {
        // The context stores an error state that is rendered below.
      })
    }
  }, [payload, finalBrief, isRunning, navigate, runWorkflow])

  const agentKeys = ['research', 'competitorIntelligence', 'copywriter', 'artDirector', 'manager']

  const completedCount = useMemo(() => {
    return agentKeys.filter((key) => agents[key]?.status === 'done').length
  }, [agents])

  const hasFailure = agentKeys.some((key) => agents[key]?.status === 'failed')
  const allComplete = completedCount === agentKeys.length && !!finalBrief

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            <span className="text-gradient">AI Command Center</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400">
            Running multi-agent workflow for your project details
          </p>
          {meta?.provider && (
            <p className="text-xs text-gray-500 mt-3">
              Provider: {meta.provider} | Model: {meta.model}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-400">Workflow Progress</span>
            <span className="text-sm font-medium text-neon-blue">
              {completedCount} / {agentKeys.length} Agents Complete
            </span>
          </div>
          <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / agentKeys.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {isRunning && (
          <div className="glass rounded-2xl p-4 mb-6 flex items-center gap-3 text-sm text-gray-300">
            <Loader size="sm" variant="spinner" />
            Orchestrating agent responses. This may take a few seconds.
          </div>
        )}

        {error && (
          <div className="glass rounded-2xl p-4 mb-6 border border-red-400/40 text-red-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <p className="font-semibold">Workflow failed</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-6 mb-12">
          {agentKeys.map((key, index) => (
            <div key={key} className="relative">
              <AgentStatus
                agent={agents[key]}
                expanded={expandedAgent === key}
                onToggle={() => setExpandedAgent(expandedAgent === key ? null : key)}
              />

              {index < agentKeys.length - 1 && (
                <motion.div
                  className="absolute left-1/2 -bottom-3 w-0.5 h-6 transform -translate-x-1/2"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: agents[key]?.status === 'done' ? 24 : 0,
                    opacity: agents[key]?.status === 'done' ? 1 : 0
                  }}
                  style={{
                    background: 'linear-gradient(to bottom, #00D9FF, #B537F2)'
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {allComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="text-center"
            >
              <div className="glass rounded-2xl p-6 sm:p-8 border-2 border-neon-green shadow-neon-green">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-neon-green/20 rounded-full mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-neon-green" />
                </motion.div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Workflow Complete
                </h2>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Your complete marketing brief is ready for review.
                </p>

                <Button
                  size="lg"
                  onClick={() => navigate('/brief')}
                  className="shadow-neon-blue w-full sm:w-auto"
                >
                  View Final Brief
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {hasFailure && (
          <div className="mt-6 text-center">
            <Button variant="secondary" onClick={() => navigate('/create')}>
              Retry With New Input
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkflowProgress
