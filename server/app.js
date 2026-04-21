import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import workflowRouter from './routes/workflow.js'
import authRouter from './routes/auth.js'
import campaignHistoryRouter from './routes/campaignHistory.js'

dotenv.config()

const app = express()
const sessionSecret = process.env.SESSION_SECRET || 'dev_session_secret_change_in_production'
const aiProvider = process.env.AI_PROVIDER || 'openrouter'
const aiModel = process.env.AI_MODEL || ''
const hasApiKey = Boolean(process.env.AI_API_KEY)

if (!hasApiKey) {
  console.warn('AI_API_KEY is missing. Workflow will fall back to local outputs.')
}

// Determine allowed origins based on environment
const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    const clientOrigin = process.env.CLIENT_ORIGIN
    return [
      clientOrigin,
      clientOrigin?.replace('https://', 'https://www.') // www version
    ].filter(Boolean)
  }
  
  // Development allows localhost
  return [
    'http://localhost:3000',
    'http://localhost:5000',
    process.env.CLIENT_ORIGIN
  ].filter(Boolean)
}

app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = getAllowedOrigins()
      
      if (!origin) {
        return callback(null, true) // Allow requests without Origin (like curl)
      }
      
      if (allowed.some(ao => origin.includes(ao) || ao?.includes(origin))) {
        callback(null, true)
      } else {
        callback(new Error('CORS not allowed for origin: ' + origin))
      }
    },
    credentials: true
  })
)
app.use(express.json({ limit: '1mb' }))

// Error handler for JSON parsing
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON in request body' })
  }
  next(err)
})

app.use(
  session({
    secret: process.env.SESSION_SECRET || sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24
    }
  })
)

app.get('/api/health', (_req, res) => {
  try {
    res.status(200).json({
      ok: true,
      service: 'multi-agent-workflow-api',
      timestamp: new Date().toISOString(),
      ai: {
        provider: aiProvider,
        model: aiModel,
        apiKeyConfigured: hasApiKey
      },
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

app.use('/', authRouter)
app.use('/api/auth', authRouter)
app.use('/api/workflow', workflowRouter)
app.use('/api/campaigns', campaignHistoryRouter)

app.use((err, _req, res, _next) => {
  console.error('Server error:', err?.message || err)
  
  // Prevent crashing - always send a response
  if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal server error',
      detail: process.env.NODE_ENV === 'production' ? 'An error occurred' : err?.message || 'Unknown error'
    })
  }
})

export default app
