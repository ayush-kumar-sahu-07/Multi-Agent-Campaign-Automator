import dotenv from 'dotenv'
import app from './app.js'
import { connectDatabase } from './config/db.js'
import { validateEnvironment } from './utils/validateEnv.js'

dotenv.config()

const port = process.env.PORT || 5000
const aiProvider = process.env.AI_PROVIDER || 'openrouter'
const aiModel = process.env.AI_MODEL || ''
const hasApiKey = Boolean(process.env.AI_API_KEY)

const startServer = async () => {
  try {
    validateEnvironment() // Validate environment variables first
    
    const nodeEnv = process.env.NODE_ENV || 'development'
    console.log(`Starting server in ${nodeEnv} mode...`)
    
    await connectDatabase()

    const server = app.listen(port, () => {
      console.log('')
      console.log('╔════════════════════════════════════════════════════════╗')
      console.log('║   MULTI-AGENT WORKFLOW AUTOMATOR API SERVER READY      ║')
      console.log('╚════════════════════════════════════════════════════════╝')
      console.log(`📍 Environment: ${nodeEnv}`)
      console.log(`📍 Server: http://localhost:${port}`)
      console.log(`🤖 AI Provider: ${aiProvider}`)
      console.log(`🔑 API Key: ${hasApiKey ? '✓ Configured' : '✗ MISSING'}`)
      console.log(`📦 Model: ${aiModel || 'default (see .env)'}`)
      console.log('')
    })

    server.on('error', async (error) => {
      if (error?.code !== 'EADDRINUSE') {
        console.error(error)
        process.exit(1)
      }

      // If the same API is already running on this port, avoid crashing with a noisy error.
      try {
        const response = await fetch(`http://localhost:${port}/api/health`)
        const payload = await response.json()

        if (response.ok && payload?.service === 'multi-agent-workflow-api') {
          console.log(`API server already running on http://localhost:${port}`)
          process.exit(0)
          return
        }
      } catch {
        // Fall through to hard error when another process is using the port.
      }

      console.error(`Port ${port} is already in use by another process.`)
      process.exit(1)
    })
  } catch (error) {
    console.error('Failed to start server:', error?.message || error)
    process.exit(1)
  }
}

startServer()
