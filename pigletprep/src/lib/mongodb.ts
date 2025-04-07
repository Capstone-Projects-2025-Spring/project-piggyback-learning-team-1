import mongoose from 'mongoose';

// Simple interface for caching the connection
interface ConnectionCache {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Initialize cache
const cache: ConnectionCache = {
  connection: null,
  promise: null
};

async function dbConnect(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cache.connection) {
    return cache.connection;
  }

  // Check for MongoDB URI
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in your .env file');
  }

  try {
    // Create new connection if none exists
    if (!cache.promise) {
      cache.promise = mongoose.connect(process.env.MONGODB_URI);
    }
    
    // Wait for connection
    cache.connection = await cache.promise;
    return cache.connection;
  } catch (error) {
    // Reset cache on error
    cache.promise = null;
    throw error;
  }
}

export default dbConnect;