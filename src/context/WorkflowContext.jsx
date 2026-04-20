import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { createCampaignHistoryApi, runWorkflowApi } from '../services/api'
import { buildInitialAgentsState } from '../utils/transformers'

const WorkflowContext = createContext(null)

export const useWorkflow = () => {
  const context = useContext(WorkflowContext)
  if (!context) {
    throw new Error('useWorkflow must be used within WorkflowProvider')
  }
  return context
}

export const WorkflowProvider = ({ children }) => {
  const [campaignInput, setCampaignInput] = useState(null)
  const [agents, setAgents] = useState(buildInitialAgentsState())
  const [finalBrief, setFinalBrief] = useState(null)
  const [meta, setMeta] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState(null)

  const resetWorkflow = useCallback(() => {
    setAgents(buildInitialAgentsState())
    setFinalBrief(null)
    setMeta(null)
    setError(null)
    setIsRunning(false)
  }, [])

  const runWorkflow = useCallback(async (payload) => {
    setCampaignInput(payload)
    setIsRunning(true)
    setError(null)
    setAgents(buildInitialAgentsState())
    setFinalBrief(null)

    try {
      const result = await runWorkflowApi(payload)
      setAgents(result.agents)
      setFinalBrief(result.finalBrief)
      let nextMeta = result.meta

      if (result.finalBrief && !result.historyId) {
        try {
          const saved = await createCampaignHistoryApi({
            campaignInput: payload,
            finalBrief: result.finalBrief,
            meta: result.meta
          })

          nextMeta = {
            ...(result.meta || {}),
            historyId: saved?.id || null
          }
        } catch {
          nextMeta = result.meta
        }
      } else if (result.historyId) {
        nextMeta = {
          ...(result.meta || {}),
          historyId: result.historyId
        }
      }

      setMeta(nextMeta)
      return result
    } catch (err) {
      setError(err.message || 'Workflow failed')
      throw err
    } finally {
      setIsRunning(false)
    }
  }, [])

  const value = useMemo(() => ({
    campaignInput,
    setCampaignInput,
    agents,
    setAgents,
    finalBrief,
    setFinalBrief,
    meta,
    setMeta,
    isRunning,
    error,
    runWorkflow,
    resetWorkflow
  }), [campaignInput, agents, finalBrief, meta, isRunning, error, runWorkflow, resetWorkflow])

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  )
}
