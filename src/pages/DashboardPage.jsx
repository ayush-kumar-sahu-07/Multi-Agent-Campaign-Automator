import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Navigate, useNavigate } from 'react-router-dom'
import { BarChart3, ShieldCheck, Sparkles, LogOut, History, CalendarDays, Eye, RefreshCw } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { useWorkflow } from '../context/WorkflowContext'
import { getCampaignHistoryApi, getCampaignHistoryByIdApi } from '../services/api'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { setCampaignInput, setFinalBrief, setMeta } = useWorkflow()
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState('')
  const [openingHistoryId, setOpeningHistoryId] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    const loadHistory = async () => {
      setHistoryLoading(true)
      setHistoryError('')

      try {
        const data = await getCampaignHistoryApi()
        setHistory(data.history || [])
      } catch (error) {
        setHistoryError(error?.message || 'Failed to load campaign history.')
      } finally {
        setHistoryLoading(false)
      }
    }

    loadHistory()
  }, [isAuthenticated])

  const openHistoryRecord = async (historyId) => {
    setOpeningHistoryId(historyId)
    try {
      const data = await getCampaignHistoryByIdApi(historyId)
      const record = data.record
      setCampaignInput(record.campaignInput)
      setFinalBrief(record.finalBrief)
      setMeta(record.meta)
      navigate('/brief')
    } catch (error) {
      setHistoryError(error?.message || 'Unable to open this campaign record.')
    } finally {
      setOpeningHistoryId('')
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 text-center text-gray-400">
        Loading dashboard...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-neon-blue/15 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-neon-purple/15 blur-3xl animate-pulse-slow" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-14 sm:pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-2">
            <ShieldCheck className="h-4 w-4 text-neon-green" />
            <span className="text-sm font-medium text-gray-300">Protected Dashboard</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Welcome back, <span className="text-gradient">{user.username}</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Your authenticated workspace is active. Session-based login is enabled and secured.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: Sparkles,
              title: 'Session Active',
              text: 'Your login session is maintained with secure cookies.'
            },
            {
              icon: ShieldCheck,
              title: 'Route Protected',
              text: 'Dashboard is accessible only for authenticated users.'
            },
            {
              icon: BarChart3,
              title: 'Ready to Build',
              text: 'Continue creating high-quality AI campaign workflows.'
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card variant="glass" className="h-full border border-transparent hover:border-neon-blue/50 transition-all">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <h2 className="mb-2 text-xl font-bold text-white">{item.title}</h2>
                <p className="text-gray-400 text-sm">{item.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card variant="glassDark" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold">Signed in as</p>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
          <Button variant="secondary" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-12"
        >
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue p-2.5">
                <History className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Campaign History</h2>
                <p className="text-sm text-gray-400">Reopen any generated brief anytime.</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => navigate('/create')}>
              <RefreshCw className="h-4 w-4" />
              New Campaign
            </Button>
          </div>

          {historyError ? (
            <Card variant="glassDark" className="border border-red-400/40 text-red-200">
              {historyError}
            </Card>
          ) : null}

          {historyLoading ? (
            <Card variant="glassDark" className="text-gray-400">
              Loading campaign history...
            </Card>
          ) : null}

          {!historyLoading && !history.length ? (
            <Card variant="glassDark" className="text-center">
              <p className="text-white font-semibold mb-1">No saved campaigns yet</p>
              <p className="text-sm text-gray-400 mb-5">Run a workflow to automatically store your first campaign brief.</p>
              <div className="flex justify-center">
                <Button onClick={() => navigate('/create')}>Generate First Campaign</Button>
              </div>
            </Card>
          ) : null}

          {!historyLoading && history.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {history.map((item) => (
                <Card key={item.id} variant="glass" className="border border-white/10 hover:border-neon-blue/60 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold text-white leading-snug">{item.projectTitle}</h3>
                    <span className="rounded-full bg-neon-blue/15 px-2.5 py-1 text-xs text-neon-blue border border-neon-blue/30">
                      {item.provider || 'AI'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 mb-2">Product: <span className="text-white">{item.product || 'N/A'}</span></p>
                  <p className="text-sm text-gray-400 mb-4">Audience: {item.audience || 'N/A'}</p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {(item.channels || []).slice(0, 4).map((channel) => (
                      <span
                        key={`${item.id}-${channel}`}
                        className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-gray-300"
                      >
                        {channel}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : item.generatedDate || 'Unknown date'}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => openHistoryRecord(item.id)}
                      disabled={openingHistoryId === item.id}
                    >
                      <Eye className="h-4 w-4" />
                      {openingHistoryId === item.id ? 'Opening...' : 'Open Brief'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : null}
        </motion.div>
      </section>
    </div>
  )
}

export default DashboardPage
