'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/admin/ImageUpload'
import { Loader2 } from 'lucide-react'
import { HeroSlide, HeroSlideFormData } from '@/types/hero-slide'

interface HeroSlideFormProps {
  initialData?: HeroSlide
  mode: 'create' | 'edit'
}

export default function HeroSlideForm({ initialData, mode }: HeroSlideFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<HeroSlideFormData>({
    image: initialData?.image || '',
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    description: initialData?.description || '',
    ctaText: initialData?.ctaText || '',
    ctaLink: initialData?.ctaLink || '',
    isActive: initialData?.isActive ?? true
  })

  const handleInputChange = (field: keyof HeroSlideFormData, value: any) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const url = mode === 'create' 
        ? '/api/hero-slides'
        : `/api/hero-slides/${initialData?.id}`

      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error?.details) {
          setErrors(data.error.details)
        } else {
          alert(data.error?.message || 'Terjadi kesalahan')
        }
        return
      }

      router.push('/paneladmin/hero-slides')
      router.refresh()
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Gambar Slide</h2>
        
        <ImageUpload
          value={formData.image}
          onChange={(value) => {
            const imageUrl = Array.isArray(value) ? value[0] : (typeof value === 'string' ? value : '')
            handleInputChange('image', imageUrl)
          }}
          label="Hero Image *"
          helperText="Rekomendasi: 1920x800px, max 10MB, format: JPG, PNG, WebP"
          error={errors.image}
        />
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Konten Slide</h2>

        <div>
          <Label htmlFor="title">Judul *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Contoh: Wujudkan Impian Umroh Anda"
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
        </div>

        <div>
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={formData.subtitle}
            onChange={(e) => handleInputChange('subtitle', e.target.value)}
            placeholder="Contoh: Paket Umroh Terpercaya & Terjangkau"
          />
          {errors.subtitle && <p className="text-sm text-red-600 mt-1">{errors.subtitle}</p>}
        </div>

        <div>
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Deskripsi singkat (opsional)"
            rows={3}
          />
          {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Call to Action (Optional)</h2>

        <div>
          <Label htmlFor="ctaText">Teks Tombol</Label>
          <Input
            id="ctaText"
            value={formData.ctaText}
            onChange={(e) => handleInputChange('ctaText', e.target.value)}
            placeholder="Contoh: Lihat Paket"
          />
          {errors.ctaText && <p className="text-sm text-red-600 mt-1">{errors.ctaText}</p>}
        </div>

        <div>
          <Label htmlFor="ctaLink">Link Tombol</Label>
          <Input
            id="ctaLink"
            value={formData.ctaLink}
            onChange={(e) => handleInputChange('ctaLink', e.target.value)}
            placeholder="Contoh: /paket atau https://example.com"
          />
          {errors.ctaLink && <p className="text-sm text-red-600 mt-1">{errors.ctaLink}</p>}
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Status</h2>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleInputChange('isActive', e.target.checked)}
            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
          />
          <div>
            <span className="font-medium text-gray-900">Aktifkan Slide</span>
            <p className="text-sm text-gray-500">Slide akan ditampilkan di website</p>
          </div>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-emerald-600 to-green-600"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {mode === 'create' ? 'Tambah Slide' : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  )
}
