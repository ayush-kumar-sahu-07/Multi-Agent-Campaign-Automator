export const validateEnvironment = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  
  const required = {
    production: [
      'MONGODB_URI',
      'SESSION_SECRET',
      'CLIENT_ORIGIN',
      'AI_API_KEY'
    ],
    development: [
      'SESSION_SECRET'
    ]
  }

  const requiredVars = isProduction ? required.production : required.development
  const missing = requiredVars.filter(key => !process.env[key])

  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}`
    
    if (isProduction) {
      throw new Error(message)
    } else {
      console.warn('⚠️  ' + message)
    }
  }

  // Warn about weak secrets in production
  if (isProduction && process.env.SESSION_SECRET?.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters in production')
  }

  return true
}
