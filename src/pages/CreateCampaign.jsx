import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Package, Users, Radio, Sparkles } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import { useWorkflow } from '../context/WorkflowContext'

const CreateCampaign = () => {
  const navigate = useNavigate()
  const { setCampaignInput, resetWorkflow } = useWorkflow()
  const [formData, setFormData] = useState({
    product: '',
    audience: '',
    channels: [],
    goal: '',
    budget: '',
    timeline: '',
    tone: '',
    notes: ''
  })

  const channelOptions = [
    'LinkedIn',
    'Twitter/X',
    'Instagram',
    'Facebook',
    'TikTok',
    'YouTube',
    'Email',
    'Product Hunt'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    resetWorkflow()
    setCampaignInput(formData)
    navigate('/workflow', { state: formData })
  }

  const toggleChannel = (channel) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }))
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-float" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-neon-blue" />
            <span className="text-sm font-medium text-gray-300">Campaign Generator</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Create Your <span className="text-gradient">Campaign</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Tell us about your product and watch our AI agents craft a complete marketing strategy
          </p>
        </motion.div>

        <Card variant="glass" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-neon-blue/10 to-transparent rounded-full blur-3xl" />
          
          <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
            {/* Product Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="flex items-center gap-2 text-white font-semibold mb-3">
                <Package className="w-5 h-5 text-neon-blue" />
                Product / Service
              </label>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                placeholder="e.g., AI-powered task management app"
                className="w-full px-6 py-4 glass rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue transition-all border border-white/10 hover:border-neon-blue/50"
                required
              />
            </motion.div>

            {/* Audience Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="flex items-center gap-2 text-white font-semibold mb-3">
                <Users className="w-5 h-5 text-neon-purple" />
                Target Audience
              </label>
              <input
                type="text"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                placeholder="e.g., Busy professionals aged 25-40"
                className="w-full px-6 py-4 glass rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-purple transition-all border border-white/10 hover:border-neon-purple/50"
                required
              />
            </motion.div>

            {/* Channels Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="flex items-center gap-2 text-white font-semibold mb-4">
                <Radio className="w-5 h-5 text-neon-pink" />
                Marketing Channels
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {channelOptions.map((channel) => (
                  <motion.button
                    key={channel}
                    type="button"
                    onClick={() => toggleChannel(channel)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                      formData.channels.includes(channel)
                        ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon-blue'
                        : 'glass text-gray-400 hover:text-white border border-white/10 hover:border-neon-blue/50'
                    }`}
                  >
                    {channel}
                  </motion.button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Selected: {formData.channels.length > 0 ? formData.channels.join(', ') : 'None'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                placeholder="Primary goal (e.g., lead generation)"
                className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue border border-white/10"
              />
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="Budget (e.g., $2000/month)"
                className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-purple border border-white/10"
              />
              <input
                type="text"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                placeholder="Timeline (e.g., 4 weeks)"
                className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink border border-white/10"
              />
              <input
                type="text"
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                placeholder="Brand tone (e.g., bold and friendly)"
                className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green border border-white/10"
              />
            </motion.div>

            <motion.textarea
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.38 }}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes (optional)"
              rows={3}
              className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue border border-white/10"
            />

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-6 flex justify-center"
            >
              <Button 
                type="submit" 
                size="lg"
                disabled={!formData.product || !formData.audience || formData.channels.length === 0}
                className="min-w-[220px] w-full sm:w-auto"
              >
                <Sparkles className="w-5 h-5" />
                Generate Workflow
              </Button>
            </motion.div>
          </form>
        </Card>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
        >
          {[
            { icon: '🔍', text: 'Market research in seconds' },
            { icon: '✍️', text: 'AI-crafted copy & messaging' },
            { icon: '🎨', text: 'Creative direction included' }
          ].map((item, i) => (
            <Card key={i} variant="glassDark" className="text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-sm text-gray-400">{item.text}</p>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default CreateCampaign
