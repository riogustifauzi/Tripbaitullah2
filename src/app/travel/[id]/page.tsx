'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  MapPin, Phone, Mail, Globe, Heart, Menu, X, 
  ChevronLeft, Star, Award, Users, Calendar, 
  Shield, CheckCircle, Clock, Image as ImageIcon,
  Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Copy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

export default function TravelDetail() {
  const params = useParams()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState('about')
  const [travelData, setTravelData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [travelPackages, setTravelPackages] = useState<any[]>([])

  useEffect(() => {
    fetchTravelData()
  }, [params.id])

  const fetchTravelData = async () => {
    try {
      const response = await fetch(`/api/travels/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setTravelData(data)
        // Fetch packages for this travel provider
        fetchTravelPackages(params.id as string)
      } else {
        router.push('/travel')
      }
    } catch (error) {
      console.error('Error fetching travel:', error)
      router.push('/travel')
    } finally {
      setLoading(false)
    }
  }

  const fetchTravelPackages = async (travelId: string) => {
    try {
      const response = await fetch(`/api/packages?travelId=${travelId}&status=active&limit=100`)
      if (response.ok) {
        const data = await response.json()
        setTravelPackages(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
      setTravelPackages([])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!travelData) {
    return null
  }

  // Mock data for fields not in API
  // Default fallback data
  const defaultGallery = [
    { id: '1', url: '/kaaba-hero.jpg', title: 'Masjidil Haram', description: 'Jamaah kami di Masjidil Haram' },
    { id: '2', url: '/masjid-nabawi.jpg', title: 'Masjid Nabawi', description: 'Kunjungan ke Masjid Nabawi' },
    { id: '3', url: '/luxury-hotel.jpg', title: 'Hotel Bintang 5', description: 'Akomodasi hotel premium' },
    { id: '4', url: '/arafat.jpg', title: 'Padang Arafat', description: 'Ziarah ke Padang Arafat' }
  ]

  const defaultFacilities = [
    'Hotel Bintang 5 dekat Masjidil Haram',
    'Pembimbing ibadah berpengalaman',
    'Makan 3x sehari prasmanan',
    'Bus pariwisata AC',
    'Ziarah lengkap',
    'Handling bandara',
    'Visa & asuransi',
    'Perlengkapan umroh'
  ]

  const defaultCertifications = [
    { name: 'PPIU Kemenag', number: 'No. 123/2009' },
    { name: 'IATA', number: 'Certified' },
    { name: 'ISO 9001:2015', number: 'Certified' },
    { name: 'ASITA', number: 'Member' }
  ]

  const defaultAchievements = [
    { year: '2023', title: 'Best Umroh Travel Provider', organization: 'Indonesia Travel Awards' },
    { year: '2022', title: 'Top Rated Service', organization: 'Customer Choice Awards' },
    { year: '2021', title: 'Excellence in Hospitality', organization: 'Tourism Excellence' }
  ]

  // Merge API data with defaults
  const displayData = {
    id: travelData.id,
    name: travelData.name,
    logo: travelData.logo,
    tagline: travelData.tagline || 'Melayani Perjalanan Ibadah Umroh & Haji',
    rating: travelData.rating,
    totalReviews: 1245,
    totalPackages: travelData.totalPackages,
    totalCustomers: 5420,
    experience: travelData.experience || '15 Tahun',
    verified: travelData.verified || false,
    city: travelData.city,
    address: travelData.address,
    phone: travelData.phone,
    email: travelData.email,
    website: travelData.website || 'N/A',
    description: travelData.description,
    
    // Use API data if available, otherwise use defaults
    gallery: travelData.gallery && travelData.gallery.length > 0 
      ? travelData.gallery.map((img: any) => ({
          id: img.id || img,
          url: typeof img === 'string' ? img : img.url,
          title: typeof img === 'object' ? img.title : 'Gallery Image',
          description: typeof img === 'object' ? img.description : ''
        }))
      : defaultGallery,
    
    facilities: travelData.facilities && travelData.facilities.length > 0 
      ? travelData.facilities 
      : defaultFacilities,
    
    certifications: travelData.detailedCertifications && travelData.detailedCertifications.length > 0 
      ? travelData.detailedCertifications 
      : defaultCertifications,
    
    achievements: travelData.achievements && travelData.achievements.length > 0 
      ? travelData.achievements 
      : defaultAchievements,
    
    testimonials: [
      {
        name: 'Ahmad Fauzi',
        avatar: '/avatar1.jpg',
        rating: 5,
        date: '10 November 2024',
        package: 'Umroh Reguler 9 Hari',
        comment: 'Alhamdulillah sangat puas dengan pelayanan. Dari awal pendaftaran hingga kepulangan, semuanya terorganisir dengan baik. Hotel dekat Masjidil Haram, makanan enak, dan tour guide sangat membantu. Highly recommended!'
      },
      {
        name: 'Siti Nurhaliza',
        avatar: '/avatar2.jpg',
        rating: 5,
        date: '5 November 2024',
        package: 'Umroh VIP 14 Hari',
        comment: 'Pengalaman umroh yang luar biasa! Fasilitas VIP benar-benar premium. Ustadz pembimbing sangat sabar dan membantu dalam menjalankan ibadah. Terima kasih!'
      }
    ]
  }

  // Share functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = `${displayData.name} - ${displayData.tagline}`
  const shareText = `${displayData.name}\n${displayData.tagline}\n✨ ${displayData.experience} Pengalaman\n📦 ${displayData.totalPackages} Paket Tersedia\n\nLihat detail:`

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(shareTitle)
    const encodedText = encodeURIComponent(shareText)

    let url = ''
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`
        break
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header Navigation */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/20 border-b border-white/20">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Image src="/uploads/1762771904921-h15y0ji.png" alt="Tripbaitullah Logo" width={40} height={40} className="object-contain" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Tripbaitullah
                </span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/#home" className="text-gray-700 hover:text-emerald-600 transition-colors">Beranda</a>
              <a href="/paket" className="text-gray-700 hover:text-emerald-600 transition-colors">Paket Umroh</a>
              <a href="/#providers" className="text-gray-700 hover:text-emerald-600 transition-colors">Travel Provider</a>
              <a href="/#blog" className="text-gray-700 hover:text-emerald-600 transition-colors">Blog</a>
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
            <div className="md:hidden mt-4 p-4 bg-white/80 backdrop-blur-md rounded-lg border border-white/20">
              <div className="flex flex-col space-y-4">
                <a href="/#home" className="text-gray-700 hover:text-emerald-600 transition-colors">Beranda</a>
                <a href="/paket" className="text-gray-700 hover:text-emerald-600 transition-colors">Paket Umroh</a>
                <a href="/#providers" className="text-gray-700 hover:text-emerald-600 transition-colors">Travel Provider</a>
                <a href="/#blog" className="text-gray-700 hover:text-emerald-600 transition-colors">Blog</a>
                <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                  Hubungi Kami
                </Button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Travel Header */}
          <Card className="bg-white/90 backdrop-blur-sm border-white/20 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-white rounded-lg shadow-lg flex items-center justify-center p-4">
                    <img
                      src={travelData.logo}
                      alt={travelData.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">{travelData.name}</h1>
                        {displayData.verified && (
                          <Badge className="bg-blue-500 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{displayData.tagline}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Clock className="w-4 h-4 text-emerald-600" />
                          <span>{displayData.experience} Pengalaman</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>{travelData.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>{travelData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      <span>{travelData.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      <span>{travelData.website}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                      <Phone className="w-4 h-4 mr-2" />
                      Hubungi Sekarang
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      onClick={() => setShowShareDialog(true)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Card className="bg-white/90 backdrop-blur-sm border-white/20 mb-8">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="about">Tentang</TabsTrigger>
                  <TabsTrigger value="gallery">Galeri</TabsTrigger>
                  <TabsTrigger value="packages">Paket</TabsTrigger>
                  <TabsTrigger value="certification">Sertifikasi</TabsTrigger>
                </TabsList>

                {/* About Tab */}
                <TabsContent value="about" className="space-y-6 mt-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Tentang Kami</h3>
                    <p className="text-gray-700 leading-relaxed">{travelData.description}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Fasilitas & Layanan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {displayData.facilities.map((facility: string, idx: number) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Penghargaan</h3>
                    <div className="space-y-3">
                      {displayData.achievements.map((achievement: any, idx: number) => (
                        <div key={idx} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                          <Award className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900">{achievement.title}</p>
                            <p className="text-sm text-gray-600">{achievement.organization} • {achievement.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Gallery Tab */}
                <TabsContent value="gallery" className="mt-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">Galeri Foto</h3>
                    <p className="text-gray-600">Dokumentasi perjalanan jamaah kami</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {displayData.gallery.map((image: any) => (
                      <div
                        key={image.id}
                        className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
                        onClick={() => setSelectedGalleryImage(image)}
                      >
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white font-semibold text-sm">{image.title}</p>
                            <p className="text-white/80 text-xs">{image.description}</p>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImageIcon className="w-4 h-4 text-emerald-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Packages Tab */}
                <TabsContent value="packages" className="mt-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Paket Umroh Tersedia</h3>
                    <p className="text-gray-600">Pilihan paket dari {travelData.name}</p>
                  </div>
                  {travelPackages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {travelPackages.map((pkg) => (
                        <Card 
                          key={pkg.id} 
                          className="bg-white hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                          onClick={() => router.push(`/paket/${pkg.id}`)}
                        >
                          <div className="relative">
                            <Badge className={`absolute top-4 right-4 z-10 ${pkg.flightType === 'Transit' 
                              ? 'bg-gradient-to-r from-orange-500 to-orange-600' 
                              : 'bg-gradient-to-r from-emerald-600 to-green-600'}`}>
                              {pkg.flightType || 'Langsung'}
                            </Badge>
                            <img
                              src={pkg.images?.[0] || '/luxury-hotel.jpg'}
                              alt={pkg.title}
                              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <CardContent className="p-5">
                            <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{pkg.title}</h4>
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span>{new Date(pkg.departureDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span>{pkg.departureCity || travelData.city}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <span>{pkg.duration} Hari</span>
                              </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-3">
                              <div>
                                <p className="text-2xl font-bold text-emerald-600 mb-2">
                                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(pkg.pricingTiers[0].price)}
                                </p>
                                {pkg.pricingTiers[0].cashback && pkg.pricingTiers[0].cashback > 0 && (
                                  <div className="flex items-center space-x-2">
                                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                      💰 Cashback {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(pkg.pricingTiers[0].cashback)}
                                    </Badge>
                                  </div>
                                )}
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
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">Belum ada paket umroh tersedia dari {travelData.name}</p>
                      <Button 
                        variant="outline" 
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                        onClick={() => router.push('/paket')}
                      >
                        Lihat Paket Lainnya
                      </Button>
                    </div>
                  )}
                  {travelPackages.length > 0 && (
                    <div className="text-center mt-8">
                      <Button 
                        variant="outline" 
                        className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-6 text-base font-semibold"
                        onClick={() => router.push('/paket')}
                      >
                        Lihat Semua Paket
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* Certification Tab */}
                <TabsContent value="certification" className="mt-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">Sertifikasi & Legalitas</h3>
                    <p className="text-gray-600">Terdaftar resmi dan tersertifikasi</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayData.certifications.map((cert: any, idx: number) => (
                      <Card key={idx} className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg text-gray-900 mb-1">{cert.name}</h4>
                              <p className="text-sm text-gray-600">{cert.number}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Jaminan Keamanan</h4>
                        <p className="text-sm text-blue-800">
                          {travelData.name} terdaftar resmi di Kementerian Agama RI dan memiliki izin PPIU 
                          (Penyelenggara Perjalanan Ibadah Umroh). Semua paket dilindungi asuransi perjalanan 
                          dan dana jamaah dijamin keamanannya sesuai regulasi yang berlaku.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>


              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gallery Modal */}
      <Dialog open={!!selectedGalleryImage} onOpenChange={() => setSelectedGalleryImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedGalleryImage?.title || 'Galeri Foto'}</DialogTitle>
            <DialogDescription>
              {selectedGalleryImage?.description || `Dokumentasi perjalanan jamaah ${travelData.name}`}
            </DialogDescription>
          </DialogHeader>
          {selectedGalleryImage && (
            <div className="relative">
              <img
                src={selectedGalleryImage.url}
                alt={selectedGalleryImage.title || 'Gallery'}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Travel Provider</DialogTitle>
            <DialogDescription>
              Bagikan {displayData.name} ke sosial media
            </DialogDescription>
          </DialogHeader>
          
          {/* Preview Card */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center p-2 flex-shrink-0">
                <img
                  src={displayData.logo}
                  alt={displayData.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 mb-1">{displayData.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{displayData.tagline}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span>✨ {displayData.experience}</span>
                  <span>•</span>
                  <span>📦 {displayData.totalPackages} Paket</span>
                </div>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => handleShare('whatsapp')}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              <Phone className="w-4 h-4 mr-2" />
              Share via WhatsApp
            </Button>
            
            <Button
              onClick={() => handleShare('facebook')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Share via Facebook
            </Button>
            
            <Button
              onClick={() => handleShare('twitter')}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Share via Twitter
            </Button>
            
            <Button
              onClick={() => handleShare('linkedin')}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              Share via LinkedIn
            </Button>

            <Separator />

            {/* Copy Link */}
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full"
            >
              {copySuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
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
                Platform terpercaya untuk menemukan paket umroh terbaik dari travel provider berpengalaman.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/paket" className="hover:text-white transition-colors">Paket Umroh</a></li>
                <li><a href="/#providers" className="hover:text-white transition-colors">Travel Provider</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Visa & Dokumen</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Asuransi</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Informasi</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="/#blog" className="hover:text-white transition-colors">Blog</a></li>
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
