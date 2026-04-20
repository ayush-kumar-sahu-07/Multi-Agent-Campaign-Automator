import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let memoryServer

const shouldUseMemoryFallback = process.env.MONGO_MEMORY_FALLBACK !== 'false'

const getConnectionErrorCode = (error) => {
  return error?.cause?.code || error?.code
}

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI
  const isProduction = process.env.NODE_ENV === 'production'

  if (!mongoUri) {
    if (isProduction) {
      throw new Error('MONGODB_URI is required for production deployment')
    }
    console.warn('MONGODB_URI not set. Using in-memory fallback only.')
    // Initialize in-memory for development
    memoryServer = await MongoMemoryServer.create()
    const memoryUri = memoryServer.getUri()
    await mongoose.connect(memoryUri)
    console.log('In-memory MongoDB connected (development mode)')
    return
  }

  try {
    await mongoose.connect(mongoUri)
    console.log('MongoDB connected')
    return
  } catch (error) {
    const code = getConnectionErrorCode(error)

    if (!shouldUseMemoryFallback || (code && code !== 'ECONNREFUSED')) {
      throw error
    }

    if (isProduction) {
      throw new Error('MongoDB connection failed in production')
    }

    console.warn('Primary MongoDB unavailable. Starting in-memory MongoDB fallback for local development...')
    memoryServer = await MongoMemoryServer.create()
    const memoryUri = memoryServer.getUri()
    await mongoose.connect(memoryUri)
    console.log('In-memory MongoDB connected (fallback)')
  }
}

export const disconnectDatabase = async () => {
  await mongoose.connection.close()

  if (memoryServer) {
    await memoryServer.stop()
    memoryServer = null
  }
}
