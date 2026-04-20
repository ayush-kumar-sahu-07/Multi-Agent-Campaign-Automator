import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock, Sparkles } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(formData)
      navigate('/dashboard')
    } catch (submitError) {
      setError(submitError?.message || 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-neon-blue/20 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-neon-purple/20 blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2">
            <Sparkles className="h-4 w-4 text-neon-blue" />
            <span className="text-sm font-medium text-gray-300">Welcome Back</span>
          </div>

          <h1 className="mb-3 text-4xl sm:text-5xl font-bold text-white">
            Login to Your <span className="text-gradient">Workspace</span>
          </h1>
          <p className="mx-auto max-w-xl text-gray-400 text-lg">
            Continue your AI-powered campaign workflows in seconds.
          </p>
        </motion.div>

        <div className="mx-auto w-full max-w-xl">
          <Card variant="glass" className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-gradient-to-br from-neon-blue/10 to-transparent blur-3xl" />

            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                  <Mail className="h-4 w-4 text-neon-blue" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 glass px-5 py-4 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                  <Lock className="h-4 w-4 text-neon-purple" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 glass px-5 py-4 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-neon-purple"
                  placeholder="Enter your password"
                />
              </div>

              {error ? (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                <LogIn className="h-5 w-5" />
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-center text-gray-400">
            New here?{' '}
            <Link to="/signup" className="font-semibold text-neon-blue hover:text-white transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
