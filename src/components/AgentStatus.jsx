import { motion } from 'framer-motion'
import { Search, PenTool, Palette, Briefcase, TrendingUp, CheckCircle, Loader as LoaderIcon, Clock, AlertTriangle } from 'lucide-react'
import Loader from './Loader'

const iconMap = {
  Search: Search,
  TrendingUp: TrendingUp,
  PenTool: PenTool,
  Palette: Palette,
  Briefcase: Briefcase
}

const AgentStatus = ({ agent, expanded = false, onToggle }) => {
  if (!agent) {
    return null
  }

  const Icon = iconMap[agent.icon] || Search

  const statusConfig = {
    pending: {
      color: 'text-gray-400',
      bg: 'bg-gray-400/10',
      border: 'border-gray-400/30',
      icon: Clock
    },
    running: {
      color: 'text-neon-blue',
      bg: 'bg-neon-blue/10',
      border: 'border-neon-blue',
      icon: LoaderIcon,
      glow: 'shadow-neon-blue'
    },
    done: {
      color: 'text-neon-green',
      bg: 'bg-neon-green/10',
      border: 'border-neon-green',
      icon: CheckCircle
    },
    failed: {
      color: 'text-red-300',
      bg: 'bg-red-400/10',
      border: 'border-red-400/60',
      icon: AlertTriangle
    }
  }

  const config = statusConfig[agent.status] || statusConfig.pending
  const StatusIcon = config.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`glass rounded-2xl p-6 cursor-pointer ${config.border} border-2 ${config.glow || ''}`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`${config.bg} p-3 rounded-xl`}>
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{agent.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <StatusIcon className={`w-4 h-4 ${config.color}`} />
              <span className={`text-sm font-medium ${config.color} capitalize`}>
                {agent.status}
              </span>
            </div>
          </div>
        </div>
        
        {agent.status === 'running' && (
          <Loader size="sm" variant="spinner" />
        )}
      </div>

      {agent.status === 'running' && (
        <div className="mt-4">
          <Loader variant="bar" />
        </div>
      )}

      {expanded && agent.output && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 pt-6 border-t border-white/10"
        >
          <h4 className="text-sm font-semibold text-neon-blue mb-3">Output Preview</h4>
          <div className="space-y-3 text-sm text-gray-300">
            {Object.entries(agent.output).map(([key, value]) => (
              <div key={key}>
                <span className="text-gray-500 font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                {Array.isArray(value) ? (
                  <ul className="ml-4 mt-1 space-y-1">
                    {value.map((item, i) => (
                      <li key={i} className="text-gray-300">• {item}</li>
                    ))}
                  </ul>
                ) : typeof value === 'object' ? (
                  <pre className="ml-4 mt-1 text-xs text-gray-400">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                ) : (
                  <p className="ml-4 mt-1">{value}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default AgentStatus
