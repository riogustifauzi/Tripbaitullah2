import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { settingsSchema } from '@/lib/validations/settings.schema'
import { Settings } from '@/types/settings'

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Get settings
async function getSettings(): Promise<Settings> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // Return default settings if file doesn't exist
    const defaultSettings: Settings = {
      id: 1,
      siteName: 'Tripbaitullah',
      pageTitle: 'Tripbaitullah - Platform Umroh Terpercaya',
      logo: '/logo.svg',
      favicon: '/favicon.ico',
      footerLogo: '/logo.svg',
      footerAbout: 'Platform terpercaya untuk menemukan paket umroh terbaik dari travel umroh berpengalaman.',
      footerPhone: '+62 812-3456-7890',
      footerEmail: 'info@tripbaitullah.com',
      footerAddress: 'Jakarta, Indonesia',
      footerCopyright: '© 2024 Tripbaitullah. All rights reserved.',
      packageDisplayOrder: 'newest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Save default settings
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2))
    return defaultSettings
  }
}

// Save settings
async function saveSettings(settings: Settings): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2))
}

// GET /api/settings
export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = settingsSchema.parse(body)
    
    // Get current settings
    const currentSettings = await getSettings()
    
    // Update settings
    const updatedSettings: Settings = {
      ...currentSettings,
      ...validatedData,
      updatedAt: new Date().toISOString()
    }
    
    // Save settings
    await saveSettings(updatedSettings)
    
    return NextResponse.json(updatedSettings)
  } catch (error: any) {
    console.error('Error updating settings:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
