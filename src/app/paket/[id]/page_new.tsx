'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Calendar, MapPin, Clock, ChevronLeft, Check, Menu, X,
  Phone, Mail, Heart, Share2, Hotel, Utensils, Bus, Shield, Plane, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package } from '@/types/package'
import { Travel } from '@/types/travel'

interface PackageWithTravel extends Package {
  travel?: Travel
}

export default function PackageDetail() {
  const params = useParams()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedPriceTier, setSelectedPriceTier] = useState(0)
  const [packageData, setPackageData] = useState<PackageWithTravel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPackageData()
  }, [params.id])

  const fetchPackageData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/packages/${params.id}`)
      const data = await response.json()
      setPackageData(data)
    } catch (error) {
      console.error('Error fetching package:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600">Memuat detail paket...</p>
        </div>
      </div>
    )
  }

  if (!packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Paket tidak ditemukan</h2>
          <p className="text-gray-600 mb-4">Paket yang Anda cari tidak tersedia</p>
          <Button onClick={() => router.push('/paket')}>Kembali ke Daftar Paket</Button>
        </div>
      </div>
    )
  }

  const selectedTier = packageData.pricingTiers[selectedPriceTier]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header Navigation */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-white/20">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Kembali</span>
            </Button>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Package Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <Card className="bg-white/90 backdrop-blur-sm border-white/20 overflow-hidden">
                <div className="relative h-96">
                  <img
                    src={packageData.images[selectedImage] || '/luxury-hotel.jpg'}
                    alt={packageData.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-emerald-600 to-green-600">
                      Tersedia
                    </Badge>
                  </div>
                </div>
                {packageData.images.length > 1 && (
                  <div className="p-4 flex space-x-2 overflow-x-auto">
                    {packageData.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImage === idx ? 'border-emerald-600' : 'border-gray-200'
                        }`}
                      >
                        <img src={img} alt={`${packageData.title} ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </Card>

              {/* Package Info */}
              <Card className="bg-white/90 backdrop-blur-sm border-white/20">
                <CardHeader>
                  {packageData.travel && (
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={packageData.travel.logo || '/logo.svg'}
                        alt={packageData.travel.name}
                        className="w-12 h-12 object-contain rounded-lg bg-white p-2 shadow-sm"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-900">{packageData.travel.name}</h3>
                          {packageData.travel.verified && (
                            <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0.5 flex items-center space-x-0.5">
                              <CheckCircle className="w-2.5 h-2.5" />
                              <span>Verified</span>
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{packageData.travel.city}</p>
                      </div>
                    </div>
                  )}
                  <CardTitle className="text-3xl">{packageData.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-xs text-gray-500">Keberangkatan</p>
                        <p className="font-semibold">{formatDate(packageData.departureDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-xs text-gray-500">Durasi</p>
                        <p className="font-semibold">{packageData.duration} Hari</p>
                      </div>
                    </div>
                    {packageData.travel?.city && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-xs text-gray-500">Keberangkatan dari</p>
                          <p className="font-semibold">{packageData.travel.city}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Deskripsi Paket</h3>
                    <p className="text-gray-600 whitespace-pre-line">{packageData.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Card className="bg-white/90 backdrop-blur-sm border-white/20">
                <Tabs defaultValue="facilities" className="w-full">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="facilities">Fasilitas</TabsTrigger>
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                    <TabsTrigger value="hotels">Hotel</TabsTrigger>
                  </TabsList>

                  <TabsContent value="facilities" className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Fasilitas Termasuk</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {packageData.facilities.map((facility, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <span className="text-gray-700">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="itinerary" className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Rencana Perjalanan</h3>
                    <div className="space-y-4">
                      {packageData.itinerary.map((day, idx) => (
                        <div key={idx} className="border-l-2 border-emerald-600 pl-4">
                          <h4 className="font-semibold text-emerald-600">Hari {day.day}: {day.title}</h4>
                          <ul className="mt-2 space-y-1">
                            {day.activities.map((activity, actIdx) => (
                              <li key={actIdx} className="text-gray-600 text-sm flex items-start">
                                <span className="mr-2">•</span>
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="hotels" className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Informasi Hotel</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-50 rounded-lg">
                        <h4 className="font-semibold text-emerald-700 mb-2">Hotel Makkah</h4>
                        <p className="text-gray-700">{selectedTier.hotelMakkah}</p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-lg">
                        <h4 className="font-semibold text-emerald-700 mb-2">Hotel Madinah</h4>
                        <p className="text-gray-700">{selectedTier.hotelMadinah}</p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-lg">
                        <h4 className="font-semibold text-emerald-700 mb-2">Tipe Kamar</h4>
                        <p className="text-gray-700">{selectedTier.roomType}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Right Column - Pricing */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="bg-white/90 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle>Pilih Paket</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Price Tier Selection */}
                    <div className="space-y-3">
                      {packageData.pricingTiers.map((tier, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedPriceTier(idx)}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            selectedPriceTier === idx
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{tier.name}</h4>
                            {selectedPriceTier === idx && (
                              <Check className="w-5 h-5 text-emerald-600" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500">Mulai dari</p>
                            <p className="text-xl font-bold text-emerald-600">{formatPrice(tier.price)}</p>
                            {tier.originalPrice && tier.originalPrice > tier.price && (
                              <p className="text-sm text-gray-500 line-through">{formatPrice(tier.originalPrice)}</p>
                            )}
                            {tier.cashback && tier.cashback > 0 && (
                              <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs">
                                Cashback {formatPrice(tier.cashback)}
                              </Badge>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    <Separator />

                    {/* Contact Buttons */}
                    <div className="space-y-2">
                      <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                        <Phone className="w-4 h-4 mr-2" />
                        Hubungi Kami
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Mail className="w-4 h-4 mr-2" />
                        Kirim Email
                      </Button>
                    </div>

                    {/* Travel Contact Info */}
                    {packageData.travel && (
                      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <h4 className="font-semibold text-sm">Kontak Travel</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            {packageData.travel.phone}
                          </p>
                          <p className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            {packageData.travel.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
