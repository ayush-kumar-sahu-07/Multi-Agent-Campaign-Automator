import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Users, Sparkles, Brain, Workflow, Target } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'

const LandingPage = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Research",
      description: "Our research agent analyzes market trends, competitors, and opportunities in seconds."
    },
    {
      icon: Sparkles,
      title: "Creative Copywriting",
      description: "Generate compelling ad copy and messaging that resonates with your audience."
    },
    {
      icon: Target,
      title: "Smart Art Direction",
      description: "Get creative prompts and visual direction from our AI art director."
    },
    {
      icon: Workflow,
      title: "Automated Workflows",
      description: "Multi-agent collaboration delivers complete marketing briefs automatically."
    }
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-20 sm:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8"
          >
            <Zap className="w-4 h-4 text-neon-blue" />
            <span className="text-sm font-medium text-gray-300">Next-Gen AI Workflow Automation</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="text-white">Automate Your</span>
            <br />
            <span className="text-gradient glow-text">Marketing Workflow</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-10 sm:mb-12 max-w-3xl mx-auto">
            Transform product ideas into complete marketing briefs with our intelligent multi-agent AI system. 
            <span className="text-neon-blue font-semibold"> No manual work required.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
            <Link to="/create" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/workflow" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <Users className="w-5 h-5" />
                See Agents in Action
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Animated Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
        >
          {[
            { value: "10min", label: "From Idea to Brief" },
            { value: "5 AI", label: "Specialized Agents" },
            { value: "100%", label: "Automated Process" }
          ].map((stat, i) => (
            <Card key={i} variant="glass" className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </Card>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powered by <span className="text-gradient">AI Agents</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Five specialized agents collaborate across research, competition, copy, design, and strategy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card variant="glass" className="h-full hover:border-neon-blue border-2 border-transparent transition-all duration-300">
                <div className="bg-gradient-to-r from-neon-blue to-neon-purple p-3 rounded-xl w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple <span className="text-gradient">3-Step</span> Process
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Enter Product Details",
              description: "Share your product, target audience, and marketing channels"
            },
            {
              step: "02",
              title: "AI Agents Collaborate",
              description: "Watch our specialized agents research, write, and design in real-time"
            },
            {
              step: "03",
              title: "Get Your Brief",
              description: "Download a complete, production-ready marketing brief"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative"
            >
              <div className="text-8xl font-bold text-neon-blue/10 absolute -top-8 -left-4">
                {item.step}
              </div>
              <Card variant="glass" className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <Card variant="glass" className="text-center relative overflow-hidden">
          <div className="absolute inset-0 animated-gradient opacity-10" />
          <div className="relative z-10 py-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of marketers who've automated their way to success
            </p>
            <Link to="/create">
              <Button size="lg">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  )
}

export default LandingPage
