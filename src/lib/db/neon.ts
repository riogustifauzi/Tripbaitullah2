import { neon, neonConfig } from '@neondatabase/serverless'

// Get database URL from environment variable
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL && process.env.VERCEL === '1') {
  console.warn('DATABASE_URL environment variable is not set')
}

// Create Neon SQL client
const sqlClient = DATABASE_URL ? neon(DATABASE_URL) : null

// Helper function to execute queries
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  if (!sqlClient) {
    throw new Error('Database not configured')
  }
  
  try {
    const result = await sqlClient(text, params || [])
    return result as T[]
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Helper to check if database is connected
export async function checkConnection(): Promise<boolean> {
  if (!sqlClient) return false
  
  try {
    await sqlClient`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection error:', error)
    return false
  }
}

// Export for direct use
export const sql = query
