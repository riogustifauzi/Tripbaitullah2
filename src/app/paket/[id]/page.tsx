'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Calendar, MapPin, Clock, ChevronLeft, Check, Heart, Share2, MessageCircle, Hotel, Bed, Plane, Menu, X, Phone, Mail,
  Facebook, Twitter, Linkedin, Copy, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Package } from '@/types/package'
import { Travel } from '@/types/travel'

interface PackageWithTravel extends Package {
  travel?: Travel
}

export default function PackageDetail() {
  const params = useParams()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedPriceTier, setSelectedPriceTier] = useState(0)
  const [packageData, setPackageData] = useState<PackageWithTravel | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [relatedPackages, setRelatedPackages] = useState<PackageWithTravel[]>([])
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    fetchPackageData()
  }, [params.id])

  // Auto-slide images every 3 seconds
  useEffect(() => {
    if (!packageData || packageData.images.length <= 1) return

    const interval = setInterval(() => {
      setSelectedImage((prev) => {
        const nextIndex = (prev + 1) % packageData.images.length
        return nextIndex
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [packageData])

  const fetchPackageData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/packages/${params.id}`)
      const data = await response.json()
      setPackageData(data)
      
      // Fetch related packages after getting current package data
      if (data) {
        fetchRelatedPackages(data)
      }
    } catch (error) {
      console.error('Error fetching package:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedPackages = async (currentPackage: PackageWithTravel) => {
    try {
      // Fetch packages from the same travel provider or similar duration
      const response = await fetch(`/api/packages?limit=3&status=active`)
      const data = await response.json()
      
      // Filter out current package and get related ones
      const filtered = data.data
        .filter((pkg: PackageWithTravel) => pkg.id !== currentPackage.id)
        .slice(0, 3)
      
      setRelatedPackages(filtered)
    } catch (error) {
      console.error('Error fetching related packages:', error)
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

  // Share functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  
  const getShareText = () => {
    if (!packageData) return ''
    
    const currentTier = packageData.pricingTiers[selectedPriceTier]
    
    return `🕋 *${packageData.title}*

${packageData.travel ? `🏢 Travel: ${packageData.travel.name}` : ''}
📅 Keberangkatan: ${formatDate(packageData.departureDate)}
⏰ Durasi: ${packageData.duration} Hari
✈️ Penerbangan: ${packageData.airline || 'Tersedia'} ${packageData.flightType ? `(${packageData.flightType})` : ''}
💰 Harga: ${formatPrice(currentTier.price)} (${currentTier.name})

✨ Fasilitas Unggulan:
${packageData.facilities.slice(0, 3).map(f => `• ${f}`).join('\n')}

🏨 Hotel:
• Makkah: ${currentTier.hotelMakkah}
• Madinah: ${currentTier.hotelMadinah}

Daftar sekarang! 👇`
  }

  const handleShare = (platform: string) => {
    const shareText = getShareText()
    const shareTitle = packageData ? `${packageData.title} - ${packageData.travel?.name || 'Tripbaitullah'}` : ''
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(shareTitle)
    const encodedText = encodeURIComponent(shareText)

    let url = ''
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%0A%0A${encodedUrl}`
        break
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
      setShowShareDialog(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      const shareText = getShareText()
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
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
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                <Image src="/logo.svg" alt="Tripbaitullah Logo" width={40} height={40} className="object-contain" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Tripbaitullah
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => router.push('/')} className="text-gray-700 hover:text-emerald-600 transition-colors">Beranda</button>
              <button onClick={() => router.push('/paket')} className="text-gray-700 hover:text-emerald-600 transition-colors">Paket Umroh</button>
              <button onClick={() => router.push('/travel')} className="text-gray-700 hover:text-emerald-600 transition-colors">Travel Umroh</button>
              <button onClick={() => router.push('/blog')} className="text-gray-700 hover:text-emerald-600 transition-colors">Blog</button>
              <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                Hubungi Kami
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2">
              <button onClick={() => { router.push('/'); setIsMenuOpen(false) }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg transition-colors">Beranda</button>
              <button onClick={() => { router.push('/paket'); setIsMenuOpen(false) }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg transition-colors">Paket Umroh</button>
              <button onClick={() => { router.push('/travel'); setIsMenuOpen(false) }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg transition-colors">Travel Umroh</button>
              <button onClick={() => { router.push('/blog'); setIsMenuOpen(false) }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 rounded-lg transition-colors">Blog</button>
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                Hubungi Kami
              </Button>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Package Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <Card className="bg-white/90 backdrop-blur-sm border-white/20">
                <div className="p-4">
                  <div className="relative h-96 rounded-lg overflow-hidden">
                    <img
                      key={selectedImage}
                      src={packageData.images[selectedImage] || '/luxury-hotel.jpg'}
                      alt={packageData.title}
                      className="w-full h-full object-cover transition-opacity duration-700 ease-in-out animate-in fade-in"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className={packageData.flightType === 'Transit' 
                        ? "bg-gradient-to-r from-orange-500 to-orange-600" 
                        : "bg-gradient-to-r from-emerald-600 to-green-600"}>
                        {packageData.flightType || 'Langsung'}
                      </Badge>
                    </div>
                  </div>
                </div>
                {packageData.images.length > 1 && (
                  <div className="px-4 pb-4 flex space-x-2 overflow-x-auto">
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
                    <button
                      onClick={() => router.push(`/travel/${packageData.travel?.id}`)}
                      className="flex items-center space-x-3 mb-4 w-full text-left hover:bg-gray-50 p-3 rounded-lg transition-colors group"
                    >
                      <img
                        src={packageData.travel.logo || '/logo.svg'}
                        alt={packageData.travel.name}
                        className="w-12 h-12 object-contain rounded-lg bg-white p-2 shadow-sm group-hover:shadow-md transition-shadow"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{packageData.travel.name}</h3>
                          {packageData.travel.verified && (
                            <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0.5 flex items-center space-x-0.5">
                              <CheckCircle className="w-2.5 h-2.5" />
                              <span>Verified</span>
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{packageData.travel.city}</p>
                      </div>
                      <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors rotate-180" />
                    </button>
                  )}
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-3xl flex-1">{packageData.title}</CardTitle>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      onClick={() => setShowShareDialog(true)}
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Keberangkatan</p>
                        <p className="font-semibold text-sm">{formatDate(packageData.departureDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Durasi</p>
                        <p className="font-semibold text-sm">{packageData.duration} Hari</p>
                      </div>
                    </div>
                    {(packageData.departureCity || packageData.travel?.city) && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Keberangkatan dari</p>
                          <p className="font-semibold text-sm">{packageData.departureCity || packageData.travel?.city}</p>
                        </div>
                      </div>
                    )}
                    {packageData.airline && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Plane className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Penerbangan</p>
                          <p className="font-semibold text-sm">{packageData.airline}</p>
                          {packageData.flightType && (
                            <p className="text-xs text-gray-500">({packageData.flightType})</p>
                          )}
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
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="facilities">Fasilitas</TabsTrigger>
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  </TabsList>

                  <TabsContent value="facilities" className="p-6 space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Fasilitas Termasuk</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {packageData.facilities.map((facility, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <span className="text-gray-700">{facility}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {packageData.excludedFacilities && packageData.excludedFacilities.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-semibold text-lg mb-4 text-red-600">Fasilitas Tidak Termasuk</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {packageData.excludedFacilities.map((facility, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                  <div className="w-4 h-0.5 bg-red-600 rounded"></div>
                                </div>
                                <span className="text-gray-700">{facility}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
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
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all relative ${
                            selectedPriceTier === idx
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          {tier.isPopular && (
                            <div className="absolute -top-3 left-4">
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                                ⭐ Paling Populer
                              </Badge>
                            </div>
                          )}
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{tier.name}</h4>
                            {selectedPriceTier === idx && (
                              <Check className="w-5 h-5 text-emerald-600" />
                            )}
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xl font-bold text-emerald-600">{formatPrice(tier.price)}</p>
                              {tier.originalPrice && tier.originalPrice > tier.price && (
                                <p className="text-sm text-gray-500 line-through">{formatPrice(tier.originalPrice)}</p>
                              )}
                            </div>
                            {tier.cashback && tier.cashback > 0 && (
                              <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs">
                                Cashback {formatPrice(tier.cashback)}
                              </Badge>
                            )}
                            <div className="pt-2 border-t border-gray-100 space-y-2">
                              <div className="flex items-start space-x-2">
                                <Hotel className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 text-xs">
                                  <p className="font-semibold text-gray-700">Makkah</p>
                                  <p className="text-gray-600">{tier.hotelMakkah}</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-2">
                                <Hotel className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 text-xs">
                                  <p className="font-semibold text-gray-700">Madinah</p>
                                  <p className="text-gray-600">{tier.hotelMadinah}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 text-xs">
                                <Bed className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span className="text-gray-600">{tier.roomType}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <Separator />

                    {/* WhatsApp Button */}
                    <Button 
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                      onClick={() => {
                        if (packageData.travel) {
                          const phone = packageData.travel.phone.replace(/[^0-9]/g, '')
                          const message = `Halo ${packageData.travel.name}, saya tertarik dengan paket:\n\n*${packageData.title}*\n\nPaket: ${selectedTier.name}\nHarga: ${formatPrice(selectedTier.price)}\nKeberangkatan: ${formatDate(packageData.departureDate)}\nDurasi: ${packageData.duration} Hari\n\nMohon informasi lebih lanjut. Terima kasih!`
                          const whatsappUrl = `https://wa.me/${phone.startsWith('0') ? '62' + phone.substring(1) : phone}?text=${encodeURIComponent(message)}`
                          window.open(whatsappUrl, '_blank')
                        }
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Pilih Paket
                    </Button>

                    {/* Payment Security Info */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      <p className="text-xs text-emerald-800 text-center leading-relaxed">
                        🔐 <span className="font-semibold">Pembayaran Aman</span> - Semua Transaksi Pembayaran dilakukan langsung ke Travel Penyelenggara
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Packages Section */}
      {relatedPackages.length > 0 && (
        <div className="py-12 px-4 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Paket Umroh Lainnya
              </h2>
              <p className="text-gray-600">
                Pilihan paket umroh lain yang mungkin Anda minati
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPackages.map((pkg) => (
                <Card 
                  key={pkg.id} 
                  className="bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
                  onClick={() => router.push(`/paket/${pkg.id}`)}
                >
                  <div className="relative">
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className={pkg.flightType === 'Transit' 
                        ? "bg-gradient-to-r from-orange-500 to-orange-600" 
                        : "bg-gradient-to-r from-emerald-600 to-green-600"}>
                        {pkg.flightType || 'Langsung'}
                      </Badge>
                    </div>
                    <img
                      src={pkg.images[0] || '/luxury-hotel.jpg'}
                      alt={pkg.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    {/* Travel Provider */}
                    {pkg.travel && (
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={pkg.travel.logo || '/logo.svg'}
                          alt={pkg.travel.name}
                          className="w-10 h-10 object-contain rounded-lg bg-white p-1 shadow-sm"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-1">
                            <h3 className="font-bold text-gray-900 text-sm">{pkg.travel.name}</h3>
                            {pkg.travel.verified && (
                              <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0.5 flex items-center space-x-0.5">
                                <CheckCircle className="w-2.5 h-2.5" />
                                <span>Verified</span>
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <CardTitle className="text-lg mb-3">{pkg.title}</CardTitle>
                    
                    {/* Travel Info */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>{formatDate(pkg.departureDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span>{pkg.departureCity || pkg.travel?.city || 'Jakarta'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <span>{pkg.duration} Hari</span>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    {/* Price */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Mulai dari</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xl font-bold text-emerald-600">
                              {formatPrice(pkg.pricingTiers[0].price)}
                            </p>
                            {pkg.pricingTiers[0].originalPrice && pkg.pricingTiers[0].originalPrice > pkg.pricingTiers[0].price && (
                              <p className="text-xs text-gray-500 line-through">
                                {formatPrice(pkg.pricingTiers[0].originalPrice)}
                              </p>
                            )}
                          </div>
                          {(() => {
                            // Find the maximum cashback from all pricing tiers
                            const maxCashback = Math.max(...pkg.pricingTiers.map((tier: any) => tier.cashback || 0))
                            return maxCashback > 0 && (
                              <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs">
                                Cashback {formatPrice(maxCashback)}
                              </Badge>
                            )
                          })()}
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/paket/${pkg.id}`)
                        }}
                      >
                        Lihat Detail
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bagikan Paket Umroh</DialogTitle>
            <DialogDescription>
              Bagikan paket umroh ini ke teman dan keluarga Anda
            </DialogDescription>
          </DialogHeader>
          
          {/* Package Preview */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 mb-4">
            <div className="flex space-x-3">
              <img
                src={packageData.images[0] || '/luxury-hotel.jpg'}
                alt={packageData.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-sm line-clamp-2 mb-1">{packageData.title}</h4>
                {packageData.travel && (
                  <p className="text-xs text-gray-600 mb-1">🏢 {packageData.travel.name}</p>
                )}
                <p className="text-emerald-600 font-bold">{formatPrice(selectedTier.price)}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-100 grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(packageData.departureDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{packageData.duration} Hari</span>
              </div>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Bagikan ke:</p>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex items-center justify-start space-x-2 hover:bg-green-50 hover:border-green-500"
                onClick={() => handleShare('whatsapp')}
              >
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span>WhatsApp</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center justify-start space-x-2 hover:bg-blue-50 hover:border-blue-500"
                onClick={() => handleShare('facebook')}
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>Facebook</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center justify-start space-x-2 hover:bg-sky-50 hover:border-sky-500"
                onClick={() => handleShare('twitter')}
              >
                <Twitter className="w-4 h-4 text-sky-500" />
                <span>Twitter</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center justify-start space-x-2 hover:bg-blue-50 hover:border-blue-700"
                onClick={() => handleShare('linkedin')}
              >
                <Linkedin className="w-4 h-4 text-blue-700" />
                <span>LinkedIn</span>
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Copy Link */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Atau salin link:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button
                  size="sm"
                  onClick={copyToClipboard}
                  className={copySuccess 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-emerald-600 hover:bg-emerald-700"
                  }
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Salin
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Tripbaitullah</span>
              </div>
              <p className="text-gray-400">
                Platform terpercaya untuk menemukan paket umroh terbaik dari travel umroh berpengalaman.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => router.push('/paket')} className="hover:text-white transition-colors">Paket Umroh</button></li>
                <li><button onClick={() => router.push('/travel')} className="hover:text-white transition-colors">Travel Umroh</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Visa & Dokumen</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Asuransi</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Informasi</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><button onClick={() => router.push('/blog')} className="hover:text-white transition-colors">Blog</button></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>info@tripbaitullah.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Jakarta, Indonesia</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800" />

          <div className="text-center text-gray-400">
            <p>© 2024 Tripbaitullah. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
