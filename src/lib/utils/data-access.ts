import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'src/lib/data')

export async function readData<T>(filename: string): Promise<T[]> {
  try {
    const filePath = path.join(DATA_DIR, filename)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return []
  }
}

export async function writeData<T>(filename: string, data: T[]): Promise<void> {
  const filePath = path.join(DATA_DIR, filename)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export async function findById<T extends { id: string }>(
  filename: string,
  id: string
): Promise<T | null> {
  const data = await readData<T>(filename)
  return data.find((item) => item.id === id) || null
}

export async function create<T extends { id: string }>(
  filename: string,
  item: T
): Promise<T> {
  const data = await readData<T>(filename)
  data.push(item)
  await writeData(filename, data)
  return item
}

export async function update<T extends { id: string }>(
  filename: string,
  id: string,
  updates: Partial<T>
): Promise<T | null> {
  const data = await readData<T>(filename)
  const index = data.findIndex((item) => item.id === id)
  
  if (index === -1) {
    return null
  }
  
  data[index] = { ...data[index], ...updates }
  await writeData(filename, data)
  return data[index]
}

export async function deleteById<T extends { id: string }>(
  filename: string,
  id: string
): Promise<boolean> {
  const data = await readData<T>(filename)
  const filteredData = data.filter((item) => item.id !== id)
  
  if (filteredData.length === data.length) {
    return false // Item not found
  }
  
  await writeData(filename, filteredData)
  return true
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
