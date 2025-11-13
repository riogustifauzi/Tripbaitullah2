'use client'

import { useState, useEffect } from 'react'
import { Settings as SettingsIcon } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import SettingsForm from '@/components/admin/forms/SettingsForm'
import LoadingSpinner from '@/components/admin/LoadingSpinner'
import { Settings } from '@/types/settings'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <SettingsIcon className="w-8 h-8 text-emerald-600" />
              <span>Pengaturan</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Kelola pengaturan situs, logo, dan konten footer
            </p>
          </div>
        </div>

        {/* Settings Form */}
        <SettingsForm initialData={settings || undefined} />
      </div>
    </AdminLayout>
  )
}
