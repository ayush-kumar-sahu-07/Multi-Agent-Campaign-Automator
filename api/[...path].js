import app from '../server/app.js'
import { connectDatabase } from '../server/config/db.js'
import { validateEnvironment } from '../server/utils/validateEnv.js'

let initializationPromise

const initialize = async () => {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      validateEnvironment()
      await connectDatabase()
    })()
  }

  return initializationPromise
}

export default async function handler(req, res) {
  try {
    await initialize()
    return app(req, res)
  } catch (error) {
    console.error('Vercel function initialization failed:', error?.message || error)

    if (!res.headersSent) {
      res.status(500).json({
        ok: false,
        error: 'Failed to initialize API'
      })
    }
  }
}