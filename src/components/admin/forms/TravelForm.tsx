'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import ImageUpload from '@/components/admin/ImageUpload'
import { Loader2, Plus, Trash2, Upload } from 'lucide-react'
import { Travel, TravelFormData, Certification, Achievement } from '@/types/travel'

interface TravelFormProps {
  initialData?: Travel
  mode: 'create' | 'edit'
}

const DEFAULT_FACILITIES = [
  'Hotel Bintang 5 dekat Masjidil Haram',
  'Pembimbing ibadah berpengalaman',
  'Makan 3x sehari prasmanan',
  'Bus pariwisata AC',
  'Ziarah lengkap',
  'Handling bandara',
  'Visa & asuransi',
  'Perlengkapan umroh'
]

export default function TravelForm({ initialData, mode }: TravelFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<TravelFormData>({
    name: initialData?.name || '',
    logo: initialData?.logo || '',
    city: initialData?.city || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    website: initialData?.website || '',
    description: initialData?.description || '',
    certifications: [],
    rating: 5,
    status: initialData?.status || 'active',
    verified: initialData?.verified || false,
    tagline: initialData?.tagline || '',
    experience: initialData?.experience || '',
    facilities: initialData?.facilities || [],
    detailedCertifications: initialData?.detailedCertifications || [],
    achievements: initialData?.achievements || [],
    gallery: initialData?.gallery || []
  })

  // State for dynamic fields
  const [newFacility, setNewFacility] = useState('')
  const [newCert, setNewCert] = useState<Certification>({ name: '', number: '' })
  const [newAchievement, setNewAchievement] = useState<Achievement>({ year: '', title: '', organization: '' })

  const handleInputChange = (field: keyof TravelFormData, value: any) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  // Facilities handlers
  const addFacility = () => {
    if (newFacility.trim()) {
      handleInputChange('facilities', [...(formData.facilities || []), newFacility.trim()])
      setNewFacility('')
    }
  }

  const removeFacility = (index: number) => {
    const updated = formData.facilities?.filter((_, i) => i !== index) || []
    handleInputChange('facilities', updated)
  }

  // Detailed Certifications handlers
  const addDetailedCertification = () => {
    if (newCert.name && newCert.number) {
      handleInputChange('detailedCertifications', [...(formData.detailedCertifications || []), newCert])
      setNewCert({ name: '', number: '' })
    }
  }

  const removeDetailedCertification = (index: number) => {
    const updated = formData.detailedCertifications?.filter((_, i) => i !== index) || []
    handleInputChange('detailedCertifications', updated)
  }

  // Achievements handlers
  const addAchievement = () => {
    if (newAchievement.year && newAchievement.title && newAchievement.organization) {
      handleInputChange('achievements', [...(formData.achievements || []), newAchievement])
      setNewAchievement({ year: '', title: '', organization: '' })
    }
  }

  const removeAchievement = (index: number) => {
    const updated = formData.achievements?.filter((_, i) => i !== index) || []
    handleInputChange('achievements', updated)
  }

  // Gallery handlers
  const handleGalleryUpload = (urls: string | string[]) => {
    const urlArray = Array.isArray(urls) ? urls : [urls]
    const currentGallery = formData.gallery || []
    const newGalleryItems = urlArray
      .filter(url => typeof url === 'string')
      .map((url, index) => ({
        id: `gallery-${Date.now()}-${index}`,
        url,
        title: '',
        description: ''
      }))
    handleInputChange('gallery', [...currentGallery, ...newGalleryItems])
  }

  const updateGalleryItem = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...(formData.gallery || [])]
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: value }
      handleInputChange('gallery', updated)
    }
  }

  const removeGalleryItem = (index: number) => {
    const updated = formData.gallery?.filter((_, i) => i !== index) || []
    handleInputChange('gallery', updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const url = mode === 'create' 
        ? '/api/travels'
        : `/api/travels/${initialData?.id}`

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

      router.push('/paneladmin/travels')
      router.refresh()
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Informasi Dasar</h2>

        {/* Name */}
        <div>
          <Label htmlFor="name">Nama Travel *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Contoh: Travel Al-Hijrah"
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>

        {/* Logo */}
        <div>
          <ImageUpload
            value={formData.logo as string}
            onChange={(value) => {
              const logoUrl = Array.isArray(value) ? value[0] : value
              handleInputChange('logo', typeof logoUrl === 'string' ? logoUrl : '')
            }}
            label="Logo *"
            helperText="Max 2MB, format: JPG, PNG, WebP"
            error={errors.logo}
          />
        </div>

        {/* City */}
        <div>
          <Label htmlFor="city">Kota *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Contoh: Jakarta"
          />
          {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address">Alamat *</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Alamat lengkap kantor"
            rows={3}
          />
          {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Informasi Kontak</h2>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">Telepon *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Contoh: 081234567890"
          />
          {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Contoh: info@travel.com"
          />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>

        {/* Website */}
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="Contoh: https://travel.com"
          />
          {errors.website && <p className="text-sm text-red-600 mt-1">{errors.website}</p>}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Informasi Tambahan</h2>

        {/* Description */}
        <div>
          <Label htmlFor="description">Deskripsi *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Deskripsi singkat tentang travel"
            rows={4}
          />
          {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
        </div>
      </div>

      {/* Extended Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Informasi Detail (Opsional)</h2>

        {/* Tagline */}
        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={formData.tagline}
            onChange={(e) => handleInputChange('tagline', e.target.value)}
            placeholder="Contoh: Melayani Perjalanan Ibadah Umroh & Haji"
          />
        </div>

        {/* Experience */}
        <div>
          <Label htmlFor="experience">Pengalaman</Label>
          <Input
            id="experience"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            placeholder="Contoh: 15 Tahun"
          />
        </div>
      </div>

      {/* Facilities & Services */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Fasilitas & Layanan</h2>
        
        {/* Quick Add Default Facilities */}
        <div>
          <Label>Tambah Fasilitas Umum</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {DEFAULT_FACILITIES.map((facility) => (
              <Button
                key={facility}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!formData.facilities?.includes(facility)) {
                    handleInputChange('facilities', [...(formData.facilities || []), facility])
                  }
                }}
                disabled={formData.facilities?.includes(facility)}
                className="text-xs justify-start"
              >
                <Plus className="w-3 h-3 mr-1" />
                {facility.substring(0, 25)}...
              </Button>
            ))}
          </div>
        </div>

        {/* Add Custom Facility */}
        <div>
          <Label>Tambah Fasilitas Custom</Label>
          <div className="flex space-x-2">
            <Input
              value={newFacility}
              onChange={(e) => setNewFacility(e.target.value)}
              placeholder="Masukkan fasilitas..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
            />
            <Button type="button" onClick={addFacility} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Facilities List */}
        {formData.facilities && formData.facilities.length > 0 && (
          <div>
            <Label>Fasilitas Terpilih ({formData.facilities.length})</Label>
            <div className="space-y-2 mt-2">
              {formData.facilities.map((facility, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">{facility}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFacility(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Certifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Sertifikasi Detail</h2>
        
        {/* Add Certification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nama Sertifikasi</Label>
            <Input
              value={newCert.name}
              onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
              placeholder="Contoh: PPIU Kemenag"
            />
          </div>
          <div>
            <Label>Nomor Sertifikasi</Label>
            <div className="flex space-x-2">
              <Input
                value={newCert.number}
                onChange={(e) => setNewCert({ ...newCert, number: e.target.value })}
                placeholder="Contoh: No. 123/2009"
              />
              <Button type="button" onClick={addDetailedCertification} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Certifications List */}
        {formData.detailedCertifications && formData.detailedCertifications.length > 0 && (
          <div>
            <Label>Sertifikasi Terdaftar ({formData.detailedCertifications.length})</Label>
            <div className="space-y-2 mt-2">
              {formData.detailedCertifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-sm">{cert.name}</p>
                    <p className="text-xs text-gray-600">{cert.number}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDetailedCertification(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Penghargaan</h2>
        
        {/* Add Achievement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Tahun</Label>
            <Input
              value={newAchievement.year}
              onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
              placeholder="2023"
            />
          </div>
          <div>
            <Label>Judul Penghargaan</Label>
            <Input
              value={newAchievement.title}
              onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
              placeholder="Best Umroh Travel Umroh"
            />
          </div>
          <div>
            <Label>Organisasi</Label>
            <div className="flex space-x-2">
              <Input
                value={newAchievement.organization}
                onChange={(e) => setNewAchievement({ ...newAchievement, organization: e.target.value })}
                placeholder="Indonesia Travel Awards"
              />
              <Button type="button" onClick={addAchievement} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Achievements List */}
        {formData.achievements && formData.achievements.length > 0 && (
          <div>
            <Label>Penghargaan Terdaftar ({formData.achievements.length})</Label>
            <div className="space-y-2 mt-2">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-sm">{achievement.title}</p>
                    <p className="text-xs text-gray-600">{achievement.organization} • {achievement.year}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAchievement(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gallery */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Galeri Foto</h2>
        
        {/* Upload Gallery Images */}
        <div>
          <ImageUpload
            value={[]}
            onChange={handleGalleryUpload}
            label="Upload Foto Galeri"
            helperText="Upload multiple images (Max 5MB each)"
            multiple
          />
        </div>

        {/* Gallery Items */}
        {formData.gallery && formData.gallery.length > 0 && (
          <div>
            <Label>Foto Galeri ({formData.gallery.length})</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {formData.gallery.map((item, index) => (
                <div key={item.id || index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={item.url}
                      alt={item.title || 'Gallery'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor={`gallery-title-${index}`} className="text-xs">Judul Foto</Label>
                      <Input
                        id={`gallery-title-${index}`}
                        value={item.title}
                        onChange={(e) => updateGalleryItem(index, 'title', e.target.value)}
                        placeholder="Contoh: Masjidil Haram"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`gallery-desc-${index}`} className="text-xs">Deskripsi Foto</Label>
                      <Input
                        id={`gallery-desc-${index}`}
                        value={item.description}
                        onChange={(e) => updateGalleryItem(index, 'description', e.target.value)}
                        placeholder="Contoh: Jamaah kami di Masjidil Haram"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeGalleryItem(index)}
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Foto
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Status Publikasi</h2>
        
        <div>
          <Label htmlFor="status">Status *</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'inactive')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="active">Active - Tampil di website</option>
            <option value="inactive">Inactive - Tidak tampil di website</option>
          </select>
          {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status}</p>}
          <p className="text-sm text-gray-500 mt-2">
            Travel umroh dengan status Active akan ditampilkan di halaman publik
          </p>
        </div>

        <Separator />

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="verified"
            checked={formData.verified || false}
            onChange={(e) => handleInputChange('verified', e.target.checked)}
            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 mt-0.5"
          />
          <div className="flex-1">
            <Label htmlFor="verified" className="cursor-pointer">
              Status Verifikasi Travel Umroh
            </Label>
            <p className="text-sm text-gray-500 mt-1">
              Centang untuk menandai travel ini sebagai terverifikasi. Travel terverifikasi akan mendapat badge khusus di halaman publik.
            </p>
          </div>
        </div>
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
          {mode === 'create' ? 'Tambah Travel' : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  )
}
