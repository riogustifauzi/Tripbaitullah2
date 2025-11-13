'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings, PackageDisplayOrder } from '@/types/settings'
import { settingsSchema } from '@/lib/validations/settings.schema'
import FormError from '@/components/admin/FormError'
import ImageUpload from '@/components/admin/ImageUpload'
import { Save, Globe, Image as ImageIcon, FileText, Package } from 'lucide-react'

interface SettingsFormProps {
  initialData?: Settings
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    siteName: initialData?.siteName || 'Tripbaitullah',
    pageTitle: initialData?.pageTitle || 'Tripbaitullah - Platform Umroh Terpercaya',
    logo: initialData?.logo || '/logo.svg',
    favicon: initialData?.favicon || '/favicon.ico',
    footerLogo: initialData?.footerLogo || '/logo.svg',
    footerAbout: initialData?.footerAbout || '',
    footerPhone: initialData?.footerPhone || '',
    footerEmail: initialData?.footerEmail || '',
    footerAddress: initialData?.footerAddress || '',
    footerCopyright: initialData?.footerCopyright || '© 2024 Tripbaitullah. All rights reserved.',
    packageDisplayOrder: (initialData?.packageDisplayOrder || 'newest') as PackageDisplayOrder
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Validate form data
      settingsSchema.parse(formData)

      // Submit to API
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save settings')
      }

      // Show success message
      alert('Pengaturan berhasil disimpan!')
      
      // Reload page to reflect changes
      window.location.reload()
    } catch (error: any) {
      console.error('Error saving settings:', error)
      
      if (error.errors) {
        // Zod validation errors
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message
          }
        })
        setErrors(newErrors)
      } else {
        alert(error.message || 'Gagal menyimpan pengaturan')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Site Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Informasi Situs</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="siteName">Nama Situs *</Label>
            <Input
              id="siteName"
              value={formData.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              placeholder="Tripbaitullah"
            />
            <FormError error={errors.siteName} />
          </div>

          <div>
            <Label htmlFor="pageTitle">Judul Halaman (Page Title) *</Label>
            <Input
              id="pageTitle"
              value={formData.pageTitle}
              onChange={(e) => handleChange('pageTitle', e.target.value)}
              placeholder="Tripbaitullah - Platform Umroh Terpercaya"
            />
            <FormError error={errors.pageTitle} />
            <p className="text-sm text-gray-500 mt-1">
              Judul yang ditampilkan di tab browser (menggantikan "Z.ai Code Scaffold - AI-Powered")
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5" />
            <span>Branding</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Logo Situs *</Label>
            <p className="text-sm text-gray-500 mb-2">
              Logo yang ditampilkan di header dan sidebar admin
            </p>
            <ImageUpload
              value={formData.logo}
              onChange={(url) => handleChange('logo', Array.isArray(url) ? url[0] : url)}
            />
            <FormError error={errors.logo} />
          </div>

          <Separator />

          <div>
            <Label>Favicon *</Label>
            <p className="text-sm text-gray-500 mb-2">
              Icon yang ditampilkan di tab browser (16x16 atau 32x32 px)
            </p>
            <ImageUpload
              value={formData.favicon}
              onChange={(url) => handleChange('favicon', Array.isArray(url) ? url[0] : url)}
            />
            <FormError error={errors.favicon} />
          </div>

          <Separator />

          <div>
            <Label>Logo Footer *</Label>
            <p className="text-sm text-gray-500 mb-2">
              Logo yang ditampilkan di footer website (menggantikan icon Love)
            </p>
            <ImageUpload
              value={formData.footerLogo}
              onChange={(url) => handleChange('footerLogo', Array.isArray(url) ? url[0] : url)}
            />
            <FormError error={errors.footerLogo} />
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Pengaturan Tampilan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="packageDisplayOrder">Urutan Paket Umroh *</Label>
            <Select
              value={formData.packageDisplayOrder}
              onValueChange={(value) => handleChange('packageDisplayOrder', value)}
            >
              <SelectTrigger id="packageDisplayOrder">
                <SelectValue placeholder="Pilih urutan tampilan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Paling Baru di Upload</SelectItem>
                <SelectItem value="random">Random (Acak setiap refresh)</SelectItem>
              </SelectContent>
            </Select>
            <FormError error={errors.packageDisplayOrder} />
            <p className="text-sm text-gray-500 mt-1">
              Mengatur urutan tampilan paket umroh di halaman Home dan halaman Paket
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Konten Footer</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="footerAbout">Deskripsi *</Label>
            <Textarea
              id="footerAbout"
              value={formData.footerAbout}
              onChange={(e) => handleChange('footerAbout', e.target.value)}
              placeholder="Platform terpercaya untuk menemukan paket umroh terbaik..."
              rows={3}
            />
            <FormError error={errors.footerAbout} />
          </div>

          <div>
            <Label htmlFor="footerPhone">Nomor Telepon *</Label>
            <Input
              id="footerPhone"
              value={formData.footerPhone}
              onChange={(e) => handleChange('footerPhone', e.target.value)}
              placeholder="+62 812-3456-7890"
            />
            <FormError error={errors.footerPhone} />
          </div>

          <div>
            <Label htmlFor="footerEmail">Email *</Label>
            <Input
              id="footerEmail"
              type="email"
              value={formData.footerEmail}
              onChange={(e) => handleChange('footerEmail', e.target.value)}
              placeholder="info@tripbaitullah.com"
            />
            <FormError error={errors.footerEmail} />
          </div>

          <div>
            <Label htmlFor="footerAddress">Alamat *</Label>
            <Input
              id="footerAddress"
              value={formData.footerAddress}
              onChange={(e) => handleChange('footerAddress', e.target.value)}
              placeholder="Jakarta, Indonesia"
            />
            <FormError error={errors.footerAddress} />
          </div>

          <div>
            <Label htmlFor="footerCopyright">Copyright *</Label>
            <Input
              id="footerCopyright"
              value={formData.footerCopyright}
              onChange={(e) => handleChange('footerCopyright', e.target.value)}
              placeholder="© 2024 Tripbaitullah. All rights reserved."
            />
            <FormError error={errors.footerCopyright} />
            <p className="text-sm text-gray-500 mt-1">
              Teks copyright yang ditampilkan di bagian bawah footer
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </Button>
      </div>
    </form>
  )
}
