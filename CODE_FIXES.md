# Code Fixes Required for Production

This document lists all code changes needed before Vercel deployment.

## Priority Fixes (Do These First)

### Fix 1: Update `server/.env.example` with PRODUCTION values

**File:** `server/.env.example`

**Current:**
```
MONGODB_URI=mongodb://127.0.0.1:27017/multi-agent-workflow-automator
```

**Change to:**
```
MONGODB_URI=mongodb+srv://automator_user:PASSWORD@cluster0.xxxxx.mongodb.net/workflow_automator?retryWrites=true&w=majority
```

---

### Fix 2: Update `server/config/db.js` to fail on missing URI in production

**File:** `server/config/db.js`

**Current:**
```javascript
export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing in server/.env')
  }
```

**Change to:**
```javascript
export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI
  const isProduction = process.env.NODE_ENV === 'production'

  if (!mongoUri) {
    if (isProduction) {
      throw new Error('MONGODB_URI is required for production deployment')
    }
    console.warn('MONGODB_URI not set. Using in-memory fallback only.')
    // ... rest of code
```

---

### Fix 3: Update `server/app.js` - Improve CORS for production

**File:** `server/app.js`

**Current:**
```javascript
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000'

app.use(
  cors({
    origin: clientOrigin,
    credentials: true
  })
)
```

**Change to:**
```javascript
// Determine allowed origins based on environment
const getAllowedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    // Strict production origins
    return [
      process.env.CLIENT_ORIGIN,
      process.env.CLIENT_ORIGIN?.replace('https://', 'https://www.') // www version
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
```

---

### Fix 4: Update `server/app.js` - Add NODE_ENV check for secure cookies

**File:** `server/app.js`

**Current:**
```javascript
cookie: {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 1000 * 60 * 60 * 24
}
```

**Change to:**
```javascript
cookie: {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
}
```

---

### Fix 5: Update `server/app.js` - Add health check logging

**File:** `server/app.js`

**Current:**
```javascript
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'multi-agent-workflow-api',
    ai: {
      provider: aiProvider,
      model: aiModel,
      apiKeyConfigured: hasApiKey
    }
  })
})
```

**Change to:**
```javascript
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
```

---

### Fix 6: Update `src/services/api.js` - Handle API base URL better

**File:** `src/services/api.js`

**Current:**
```javascript
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const request = async (path, { method = 'GET', body } = {}) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 45000)
```

**Change to:**
```javascript
const API_BASE = (() => {
  const base = import.meta.env.VITE_API_BASE_URL || ''
  const cleaned = base.replace(/\/$/, '')
  
  if (!cleaned) {
    console.warn('VITE_API_BASE_URL not set. Using /api as fallback.')
    return ''
  }
  
  return cleaned
})()

const request = async (path, { method = 'GET', body } = {}) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 45000)
  
  const url = API_BASE ? `${API_BASE}${path}` : path
```

---

### Fix 7: Update `vite.config.js` - Production optimizations

**File:** `vite.config.js`

**Current:**
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

**Change to:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 3000,
    open: false, // Don't auto-open in production
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development', // No sourcemaps in production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion']
        }
      }
    }
  }
})
```

---

### Fix 8: Update `server/index.js` - Better error handling

**File:** `server/index.js`

**Current:**
```javascript
const startServer = async () => {
  try {
    await connectDatabase()

    const server = app.listen(port, () => {
      console.log('')
      console.log('╔════════════════════════════════════════════════════════╗')
      console.log('║   MULTI-AGENT WORKFLOW AUTOMATOR API SERVER READY      ║')
      console.log('╚════════════════════════════════════════════════════════╝')
```

**Change to:**
```javascript
const startServer = async () => {
  try {
    console.log('Starting server in', process.env.NODE_ENV || 'development', 'mode...')
    
    await connectDatabase()

    const server = app.listen(port, () => {
      console.log('')
      console.log('╔════════════════════════════════════════════════════════╗')
      console.log('║   MULTI-AGENT WORKFLOW AUTOMATOR API SERVER READY      ║')
      console.log('╚════════════════════════════════════════════════════════╝')
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`📍 Server: http://localhost:${port}`)
```

---

### Fix 9: Create `server/utils/validateEnv.js` - Environment validation

**New File:** `server/utils/validateEnv.js`

```javascript
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

  // Warn about weak secrets
  if (isProduction && process.env.SESSION_SECRET?.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters in production')
  }

  return true
}
```

**Update `server/index.js`** to call this:
```javascript
import { validateEnvironment } from './utils/validateEnv.js'

const startServer = async () => {
  try {
    validateEnvironment() // Add this line
    
    console.log('Starting server in', process.env.NODE_ENV || 'development', 'mode...')
    await connectDatabase()
    // ... rest of code
```

---

### Fix 10: Update `server/.env.example` - Production template

**File:** `server/.env.example`

```
# Provider: openrouter | groq
AI_PROVIDER=openrouter
AI_API_KEY=your_new_api_key_here (generate at https://openrouter.ai)
AI_MODEL=meta-llama/llama-3.1-8b-instruct
AI_REQUEST_TIMEOUT_MS=30000
AI_MAX_TOKENS=2000
AI_FAST_MODE=false

# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://automator_user:PASSWORD@cluster0.xxxxx.mongodb.net/workflow_automator?retryWrites=true&w=majority

# Session Security
SESSION_SECRET=generate_using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# CORS
CLIENT_ORIGIN=https://yourdomain.vercel.app

# Features
MONGO_MEMORY_FALLBACK=false
```

---

## Optional but Recommended Fixes

### Optional Fix 1: Add logging utility

**New File:** `server/utils/logger.js`

```javascript
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL || 'info']

export const logger = {
  debug: (msg) => currentLevel <= LOG_LEVELS.debug && console.log('[DEBUG]', msg),
  info: (msg) => currentLevel <= LOG_LEVELS.info && console.log('[INFO]', msg),
  warn: (msg) => currentLevel <= LOG_LEVELS.warn && console.warn('[WARN]', msg),
  error: (msg) => currentLevel <= LOG_LEVELS.error && console.error('[ERROR]', msg)
}
```

### Optional Fix 2: Add request logging middleware

**Update `server/app.js`:**

```javascript
// Add after middleware setup
app.use((req, res, next) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    const status = res.statusCode
    const emoji = status < 400 ? '✓' : status < 500 ? '⚠' : '✗'
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`${emoji} ${req.method} ${req.path} ${status} (${duration}ms)`)
    }
  })
  
  next()
})
```

---

## Testing Changes Locally

After making changes, test locally:

```bash
# Install dependencies
npm install
npm --prefix server install

# Test build
npm run build

# Test in production mode
NODE_ENV=production npm start

# Test API health
curl http://localhost:5000/api/health

# Test in browser
# Navigate to http://localhost:3000
# Try signup, login, create campaign
```

---

## Checklist Before Committing

- [ ] `.gitignore` created and updated
- [ ] `vercel.json` created
- [ ] `DEPLOYMENT_ANALYSIS.md` created
- [ ] `VERCEL_SETUP_GUIDE.md` created
- [ ] `CODE_FIXES.md` created (this file)
- [ ] `server/.env.example` updated with production template
- [ ] `server/config/db.js` updated with production checks
- [ ] `server/app.js` updated with CORS and cookies
- [ ] `server/index.js` updated with environment logging
- [ ] `vite.config.js` updated with build optimizations
- [ ] `src/services/api.js` updated with better error handling
- [ ] `server/utils/validateEnv.js` created
- [ ] All changes committed to git
- [ ] No real API keys or secrets in code or git history

---

## Implementation Order

1. Create new files (`.gitignore`, `vercel.json`, deployment docs)
2. Update existing files (fixes 1-8)
3. Create utility files (validateEnv.js)
4. Test locally
5. Commit and push to GitHub
6. Follow VERCEL_SETUP_GUIDE.md for deployment

---

**Ready to deploy after all fixes are applied! 🚀**
