import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

// Define the shape of the cached object
interface MongooseGlobal {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Use Node.js globalThis with custom type
declare global {
  // Allow modification of `global` to store mongoose connection
  var mongoose: MongooseGlobal | undefined
}

// Initialize global.mongoose if not already set
const cached = global.mongoose ??= { conn: null, promise: null }

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
