'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/admin/ImageUpload'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { Package, PackageFormData, PricingTier, ItineraryDay } from '@/types/package'
import { Travel } from '@/types/travel'

interface PackageFormProps {
  initialData?: Package
  mode: 'create' | 'edit'
}

export default function PackageForm({ initialData, mode }: PackageFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [travels, setTravels] = useState<Travel[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<PackageFormData>({
    title: initialData?.title || '',
    travelId: initialData?.travelId || '',
    description: initialData?.description || '',
    duration: initialData?.duration || 9,
    departureDate: initialData?.departureDate ? new Date(initialData.departureDate) : new Date(),
    returnDate: initialData?.returnDate ? new Date(initialData.returnDate) : new Date(),
    departureCity: initialData?.departureCity || '',
    airline: initialData?.airline || '',
    flightType: initialData?.flightType || 'Langsung',
    pricingTiers: initialData?.pricingTiers || [
      { 
        name: 'Standard', 
        price: 22500000, 
        originalPrice: 0,
        cashback: 0,
        hotelMakkah: 'Hotel Bintang 3', 
        hotelMadinah: 'Hotel Bintang 3', 
        roomType: 'Quad', 
        additionalFacilities: [],
        isPopular: false
      }
    ],
    facilities: initialData?.facilities || [],
    excludedFacilities: initialData?.excludedFacilities || [],
    itinerary: initialData?.itinerary || [
      { day: 1, title: 'Hari 1', activities: ['Keberangkatan dari Indonesia'] }
    ],
    images: initialData?.images || [],
    status: initialData?.status || 'draft'
  })

  useEffect(() => {
    fetchTravels()
  }, [])

  const fetchTravels = async () => {
    try {
      const response = await fetch('/api/travels?limit=100')
      const data = await response.json()
      setTravels(data.data.filter((t: Travel) => t.status === 'active'))
    } catch (error) {
      console.error('Error fetching travels:', error)
    }
  }

  const handleInputChange = (field: keyof PackageFormData, value: any) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  // Pricing Tier Management
  const addPricingTier = () => {
    const newTier: PricingTier = {
      name: 'Premium',
      price: 0,
      originalPrice: 0,
      cashback: 0,
      hotelMakkah: '',
      hotelMadinah: '',
      roomType: 'Double',
      additionalFacilities: [],
      isPopular: false
    }
    handleInputChange('pricingTiers', [...formData.pricingTiers, newTier])
  }

  const updatePricingTier = (index: number, field: keyof PricingTier, value: any) => {
    const updated = [...formData.pricingTiers]
    updated[index] = { ...updated[index], [field]: value }
    handleInputChange('pricingTiers', updated)
  }

  const removePricingTier = (index: number) => {
    if (formData.pricingTiers.length > 1) {
      handleInputChange('pricingTiers', formData.pricingTiers.filter((_, i) => i !== index))
    }
  }

  // Itinerary Management
  const addItineraryDay = () => {
    const newDay: ItineraryDay = {
      day: formData.itinerary.length + 1,
      title: `Hari ${formData.itinerary.length + 1}`,
      activities: ['']
    }
    handleInputChange('itinerary', [...formData.itinerary, newDay])
  }

  const updateItineraryDay = (index: number, field: keyof ItineraryDay, value: any) => {
    const updated = [...formData.itinerary]
    updated[index] = { ...updated[index], [field]: value }
    handleInputChange('itinerary', updated)
  }

  const removeItineraryDay = (index: number) => {
    if (formData.itinerary.length > 1) {
      handleInputChange('itinerary', formData.itinerary.filter((_, i) => i !== index))
    }
  }

  const addActivity = (dayIndex: number) => {
    const updated = [...formData.itinerary]
    updated[dayIndex].activities.push('')
    handleInputChange('itinerary', updated)
  }

  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    const updated = [...formData.itinerary]
    updated[dayIndex].activities[activityIndex] = value
    handleInputChange('itinerary', updated)
  }

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const updated = [...formData.itinerary]
    if (updated[dayIndex].activities.length > 1) {
      updated[dayIndex].activities.splice(activityIndex, 1)
      handleInputChange('itinerary', updated)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Client-side validation
    const validationErrors: Record<string, string> = {}

    if (!formData.title || formData.title.trim().length < 10) {
      validationErrors.title = 'Judul minimal 10 karakter'
    }

    if (!formData.travelId) {
      validationErrors.travelId = 'Travel provider harus dipilih'
    }

    if (!formData.description || formData.description.trim().length < 20) {
      validationErrors.description = 'Deskripsi minimal 20 karakter'
    }

    if (formData.facilities.length === 0) {
      validationErrors.facilities = 'Minimal 1 fasilitas harus dipilih'
    }

    if (formData.images.length < 3) {
      validationErrors.images = 'Minimal 3 gambar diperlukan'
    }

    // Validate pricing tiers
    formData.pricingTiers.forEach((tier, index) => {
      if (!tier.name || tier.name.trim() === '') {
        validationErrors[`pricingTier_${index}_name`] = `Nama tier ${index + 1} diperlukan`
      }
      if (!tier.price || tier.price <= 0) {
        validationErrors[`pricingTier_${index}_price`] = `Harga tier ${index + 1} harus lebih dari 0`
      }
      if (!tier.hotelMakkah || tier.hotelMakkah.trim() === '') {
        validationErrors[`pricingTier_${index}_hotelMakkah`] = `Hotel Makkah tier ${index + 1} diperlukan`
      }
      if (!tier.hotelMadinah || tier.hotelMadinah.trim() === '') {
        validationErrors[`pricingTier_${index}_hotelMadinah`] = `Hotel Madinah tier ${index + 1} diperlukan`
      }
      if (!tier.roomType || tier.roomType.trim() === '') {
        validationErrors[`pricingTier_${index}_roomType`] = `Tipe kamar tier ${index + 1} diperlukan`
      }
    })

    // Validate itinerary
    formData.itinerary.forEach((day, index) => {
      if (!day.title || day.title.trim() === '') {
        validationErrors[`itinerary_${index}_title`] = `Judul hari ${index + 1} diperlukan`
      }
      const validActivities = day.activities.filter(a => a && a.trim() !== '')
      if (validActivities.length === 0) {
        validationErrors[`itinerary_${index}_activities`] = `Minimal 1 aktivitas untuk hari ${index + 1}`
      }
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setLoading(false)
      alert('Mohon lengkapi semua field yang diperlukan')
      return
    }

    try {
      const url = mode === 'create' 
        ? '/api/packages'
        : `/api/packages/${initialData?.id}`

      // Prepare data with all fields
      const submitData = {
        title: formData.title,
        travelId: formData.travelId,
        description: formData.description,
        duration: formData.duration,
        departureDate: formData.departureDate.toISOString(),
        returnDate: formData.returnDate.toISOString(),
        departureCity: formData.departureCity || '',
        airline: formData.airline || '',
        flightType: formData.flightType || 'Langsung',
        pricingTiers: formData.pricingTiers.map(tier => ({
          ...tier,
          price: Number(tier.price) || 0,
          originalPrice: tier.originalPrice ? Number(tier.originalPrice) : undefined,
          cashback: tier.cashback ? Number(tier.cashback) : undefined,
          isPopular: tier.isPopular || false
        })),
        facilities: formData.facilities,
        excludedFacilities: (formData.excludedFacilities || []).filter(f => f && f.trim() !== ''),
        itinerary: formData.itinerary.map(day => ({
          ...day,
          activities: day.activities.filter(a => a && a.trim() !== '')
        })),
        images: formData.images.filter((img): img is string => typeof img === 'string'),
        status: formData.status
      }

      console.log('Submitting data:', submitData)

      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      let data: any
      try {
        const text = await response.text()
        console.log('Response text:', text)
        data = text ? JSON.parse(text) : {}
      } catch (e) {
        console.error('Failed to parse response:', e)
        data = {}
      }

      if (!response.ok) {
        console.error('Error response:', data)
        
        // Handle validation errors
        if (data.error?.details) {
          const errorMessages = Object.entries(data.error.details)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n')
          alert('Validation error:\n' + errorMessages)
          setErrors(data.error.details)
        } else {
          alert(data.error?.message || 'Terjadi kesalahan: ' + response.status)
        }
        return
      }

      alert('Data berhasil disimpan!')
      router.push('/paneladmin/packages')
      router.refresh()
    } catch (error) {
      console.error('Submit error:', error)
      alert('Terjadi kesalahan saat menyimpan data: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Informasi Dasar</h2>

        <div>
          <Label htmlFor="title">Judul Paket *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Contoh: Umroh Reguler 9 Hari"
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
        </div>

        <div>
          <Label htmlFor="travelId">Travel Provider *</Label>
          <select
            id="travelId"
            value={formData.travelId}
            onChange={(e) => handleInputChange('travelId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Pilih Travel</option>
            {travels.map((travel) => (
              <option key={travel.id} value={travel.id}>
                {travel.name}
              </option>
            ))}
          </select>
          {errors.travelId && <p className="text-sm text-red-600 mt-1">{errors.travelId}</p>}
        </div>

        <div>
          <Label htmlFor="description">Deskripsi *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Deskripsi paket umroh"
            rows={4}
          />
          {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="duration">Durasi (hari) *</Label>
            <Input
              id="duration"
              type="number"
              min="5"
              max="30"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="departureDate">Tanggal Berangkat *</Label>
            <Input
              id="departureDate"
              type="date"
              value={formData.departureDate.toISOString().split('T')[0]}
              onChange={(e) => handleInputChange('departureDate', new Date(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="returnDate">Tanggal Kembali *</Label>
            <Input
              id="returnDate"
              type="date"
              value={formData.returnDate.toISOString().split('T')[0]}
              onChange={(e) => handleInputChange('returnDate', new Date(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="departureCity">Kota Keberangkatan (Opsional)</Label>
            <Input
              id="departureCity"
              placeholder="Contoh: Jakarta, Surabaya"
              value={formData.departureCity}
              onChange={(e) => handleInputChange('departureCity', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="airline">Maskapai (Opsional)</Label>
            <Input
              id="airline"
              placeholder="Contoh: Garuda Indonesia"
              value={formData.airline}
              onChange={(e) => handleInputChange('airline', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="flightType">Tipe Penerbangan</Label>
            <select
              id="flightType"
              value={formData.flightType}
              onChange={(e) => handleInputChange('flightType', e.target.value as 'Langsung' | 'Transit')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Langsung">Langsung</option>
              <option value="Transit">Transit</option>
            </select>
          </div>
        </div>


      </div>

      {/* Pricing Tiers */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Pricing Tiers</h2>
          <Button type="button" variant="outline" size="sm" onClick={addPricingTier}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Tier
          </Button>
        </div>

        {formData.pricingTiers.map((tier, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h3 className="font-medium">Tier {index + 1}</h3>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tier.isPopular || false}
                    onChange={(e) => updatePricingTier(index, 'isPopular', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-amber-600 font-semibold">⭐ Paling Populer</span>
                </label>
              </div>
              {formData.pricingTiers.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePricingTier(index)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <Label className="text-sm text-gray-600">Nama Tier</Label>
                <Input
                  placeholder="Nama (e.g., Standard, Premium)"
                  value={tier.name}
                  onChange={(e) => updatePricingTier(index, 'name', e.target.value)}
                />
                {errors[`pricingTier_${index}_name`] && (
                  <p className="text-sm text-red-600 mt-1">{errors[`pricingTier_${index}_name`]}</p>
                )}
              </div>
              
              <div>
                <Label className="text-sm text-gray-600">Harga Normal *</Label>
                <Input
                  type="number"
                  placeholder="Harga Normal"
                  value={tier.price}
                  onChange={(e) => updatePricingTier(index, 'price', parseInt(e.target.value) || 0)}
                />
                {errors[`pricingTier_${index}_price`] && (
                  <p className="text-sm text-red-600 mt-1">{errors[`pricingTier_${index}_price`]}</p>
                )}
              </div>
              
              <div>
                <Label className="text-sm text-gray-600">Harga Coret (Opsional)</Label>
                <Input
                  type="number"
                  placeholder="Harga Coret"
                  value={tier.originalPrice || ''}
                  onChange={(e) => updatePricingTier(index, 'originalPrice', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label className="text-sm text-gray-600">Cashback (Opsional)</Label>
                <Input
                  type="number"
                  placeholder="Cashback"
                  value={tier.cashback || ''}
                  onChange={(e) => updatePricingTier(index, 'cashback', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <Label className="text-sm text-gray-600">Tipe Kamar *</Label>
                <Input
                  placeholder="Tipe Kamar (e.g., Quad, Double)"
                  value={tier.roomType}
                  onChange={(e) => updatePricingTier(index, 'roomType', e.target.value)}
                />
                {errors[`pricingTier_${index}_roomType`] && (
                  <p className="text-sm text-red-600 mt-1">{errors[`pricingTier_${index}_roomType`]}</p>
                )}
              </div>
              
              <div>
                <Label className="text-sm text-gray-600">Hotel Makkah *</Label>
                <Input
                  placeholder="Nama Hotel Makkah"
                  value={tier.hotelMakkah}
                  onChange={(e) => updatePricingTier(index, 'hotelMakkah', e.target.value)}
                />
                {errors[`pricingTier_${index}_hotelMakkah`] && (
                  <p className="text-sm text-red-600 mt-1">{errors[`pricingTier_${index}_hotelMakkah`]}</p>
                )}
              </div>
              
              <div>
                <Label className="text-sm text-gray-600">Hotel Madinah *</Label>
                <Input
                  placeholder="Nama Hotel Madinah"
                  value={tier.hotelMadinah}
                  onChange={(e) => updatePricingTier(index, 'hotelMadinah', e.target.value)}
                />
                {errors[`pricingTier_${index}_hotelMadinah`] && (
                  <p className="text-sm text-red-600 mt-1">{errors[`pricingTier_${index}_hotelMadinah`]}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Facilities */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Fasilitas Termasuk</h2>
        <div className="space-y-2">
          {formData.facilities.map((facility, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="Contoh: Tiket Pesawat PP, Hotel Bintang 5, Visa"
                value={facility}
                onChange={(e) => {
                  const updated = [...formData.facilities]
                  updated[index] = e.target.value
                  handleInputChange('facilities', updated)
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const updated = formData.facilities.filter((_, i) => i !== index)
                  handleInputChange('facilities', updated)
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              handleInputChange('facilities', [...formData.facilities, ''])
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Fasilitas
          </Button>
        </div>
      </div>

      {/* Excluded Facilities */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Fasilitas Tidak Termasuk (Opsional)</h2>
        <div className="space-y-2">
          {(formData.excludedFacilities || []).map((facility, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="Contoh: Biaya visa tambahan"
                value={facility}
                onChange={(e) => {
                  const updated = [...(formData.excludedFacilities || [])]
                  updated[index] = e.target.value
                  handleInputChange('excludedFacilities', updated)
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const updated = (formData.excludedFacilities || []).filter((_, i) => i !== index)
                  handleInputChange('excludedFacilities', updated)
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              handleInputChange('excludedFacilities', [...(formData.excludedFacilities || []), ''])
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Fasilitas Tidak Termasuk
          </Button>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Gambar Paket</h2>
        <ImageUpload
          value={formData.images as string[]}
          onChange={(value) => handleInputChange('images', Array.isArray(value) ? value : [value])}
          multiple
          maxFiles={5}
          helperText="Upload minimal 3 gambar, maksimal 5 gambar"
        />
        {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
      </div>

      {/* Itinerary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Itinerary</h2>
          <Button type="button" variant="outline" size="sm" onClick={addItineraryDay}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Hari
          </Button>
        </div>

        {formData.itinerary.map((day, dayIndex) => (
          <div key={dayIndex} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-2">
                <Input
                  placeholder="Judul Hari"
                  value={day.title}
                  onChange={(e) => updateItineraryDay(dayIndex, 'title', e.target.value)}
                />
                {errors[`itinerary_${dayIndex}_title`] && (
                  <p className="text-sm text-red-600 mt-1">{errors[`itinerary_${dayIndex}_title`]}</p>
                )}
              </div>
              {formData.itinerary.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItineraryDay(dayIndex)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {day.activities.map((activity, actIndex) => (
                <div key={actIndex} className="flex items-center space-x-2">
                  <Input
                    placeholder="Aktivitas"
                    value={activity}
                    onChange={(e) => updateActivity(dayIndex, actIndex, e.target.value)}
                  />
                  {day.activities.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeActivity(dayIndex, actIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {errors[`itinerary_${dayIndex}_activities`] && (
                <p className="text-sm text-red-600 mt-1">{errors[`itinerary_${dayIndex}_activities`]}</p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addActivity(dayIndex)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Aktivitas
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Status</h2>
        <select
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'draft')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
        </select>
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
          {mode === 'create' ? 'Tambah Paket' : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  )
}
