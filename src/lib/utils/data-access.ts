import fs from 'fs/promises'
import path from 'path'
import { query as sql } from '@/lib/db/neon'

const DATA_DIR = path.join(process.cwd(), 'src/lib/data')
const USE_DATABASE = process.env.DATABASE_URL !== undefined

// Map filename to table name
function getTableName(filename: string): string {
  const tableMap: Record<string, string> = {
    'hero-slides.json': 'hero_slides',
    'blogs.json': 'blogs',
    'travels.json': 'travels',
    'packages.json': 'packages',
    'users.json': 'users',
  }
  return tableMap[filename] || filename.replace('.json', '')
}

// Convert snake_case to camelCase
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase)
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      acc[camelKey] = toCamelCase(obj[key])
      return acc
    }, {} as any)
  }
  return obj
}

// Convert camelCase to snake_case
function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase)
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
      acc[snakeKey] = toSnakeCase(obj[key])
      return acc
    }, {} as any)
  }
  return obj
}

export async function readData<T>(filename: string): Promise<T[]> {
  try {
    // Use PostgreSQL if DATABASE_URL is configured
    if (USE_DATABASE) {
      const tableName = getTableName(filename)
      console.log(`[DB] Reading from table: ${tableName}`)
      
      const query = `SELECT * FROM ${tableName} ORDER BY created_at DESC`
      const result = await sql(query)
      console.log(`[DB] Read ${result.length} items`)
      
      return toCamelCase(result) as T[]
    }
    
    // Fallback to file system for development
    const filePath = path.join(DATA_DIR, filename)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error(`[Data Access] Error reading ${filename}:`, error)
    return []
  }
}

export async function writeData<T>(filename: string, data: T[]): Promise<void> {
  try {
    // Use PostgreSQL if DATABASE_URL is configured
    if (USE_DATABASE) {
      // Note: This is not typically used with SQL databases
      // Individual create/update/delete operations are preferred
      console.warn(`[DB] writeData called for ${filename} - consider using create/update/delete instead`)
      return
    }
    
    // Fallback to file system for development
    const filePath = path.join(DATA_DIR, filename)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error(`[Data Access] Error writing ${filename}:`, error)
    throw error
  }
}

export async function findById<T extends { id: string }>(
  filename: string,
  id: string
): Promise<T | null> {
  try {
    if (USE_DATABASE) {
      const tableName = getTableName(filename)
      const query = `SELECT * FROM ${tableName} WHERE id = $1 LIMIT 1`
      const result = await sql(query, [id])
      
      if (result.length === 0) return null
      return toCamelCase(result[0]) as T
    }
    
    const data = await readData<T>(filename)
    return data.find((item) => item.id === id) || null
  } catch (error) {
    console.error(`[Data Access] Error finding by ID:`, error)
    return null
  }
}

export async function create<T extends { id: string }>(
  filename: string,
  item: T
): Promise<T> {
  try {
    if (USE_DATABASE) {
      const tableName = getTableName(filename)
      const snakeItem = toSnakeCase(item)
      
      // Build INSERT query dynamically
      const columns = Object.keys(snakeItem)
      const values = Object.values(snakeItem)
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ')
      
      const query = `
        INSERT INTO ${tableName} (${columns.join(', ')})
        VALUES (${placeholders})
        RETURNING *
      `
      
      const result = await sql(query, values)
      return toCamelCase(result[0]) as T
    }
    
    const data = await readData<T>(filename)
    data.push(item)
    await writeData(filename, data)
    return item
  } catch (error) {
    console.error(`[Data Access] Error creating item:`, error)
    throw error
  }
}

export async function update<T extends { id: string }>(
  filename: string,
  id: string,
  updates: Partial<T>
): Promise<T | null> {
  try {
    if (USE_DATABASE) {
      const tableName = getTableName(filename)
      const snakeUpdates = toSnakeCase(updates)
      
      // Build UPDATE query dynamically
      const columns = Object.keys(snakeUpdates).filter(k => k !== 'id')
      const setClause = columns.map((col, i) => `${col} = $${i + 2}`).join(', ')
      const values = [id, ...columns.map(col => snakeUpdates[col])]
      
      const query = `
        UPDATE ${tableName}
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `
      
      const result = await sql(query, values)
      if (result.length === 0) return null
      
      return toCamelCase(result[0]) as T
    }
    
    const data = await readData<T>(filename)
    const index = data.findIndex((item) => item.id === id)
    
    if (index === -1) return null
    
    data[index] = { ...data[index], ...updates }
    await writeData(filename, data)
    return data[index]
  } catch (error) {
    console.error(`[Data Access] Error updating item:`, error)
    return null
  }
}

export async function deleteById<T extends { id: string }>(
  filename: string,
  id: string
): Promise<boolean> {
  try {
    if (USE_DATABASE) {
      const tableName = getTableName(filename)
      const query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING id`
      const result = await sql(query, [id])
      return result.length > 0
    }
    
    const data = await readData<T>(filename)
    const filteredData = data.filter((item) => item.id !== id)
    
    if (filteredData.length === data.length) {
      return false
    }
    
    await writeData(filename, filteredData)
    return true
  } catch (error) {
    console.error(`[Data Access] Error deleting item:`, error)
    return false
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
}
