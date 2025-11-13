'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, Calendar, MapPin, Users, ChevronRight, Menu, X, Phone, Mail, Clock, Heart, Star, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Package } from '@/types/package'
import { Travel } from '@/types/travel'

interface PackageWithTravel extends Package {
  travel?: Travel
}

interface HomePackageCardProps {
  pkg: PackageWithTravel
  lowestPrice: number
  highestCashback: number
  formatPrice: (price: number) => string
  formatDate: (date: string) => string
  router: any
}

function HomePackageCard({ pkg, lowestPrice, highestCashback, formatPrice, formatDate, router }: HomePackageCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)

  // Auto-slide images when hovered
  useEffect(() => {
    if (!isHovered || pkg.images.length <= 1) return

    const interval = setInterval(() => {
      setFadeIn(false)
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % pkg.images.length)
        setFadeIn(true)
      }, 200)
    }, 1500)

    return () => clearInterval(interval)
  }, [isHovered, pkg.images.length])

  // Reset image index when not hovered
  useEffect(() => {
    if (!isHovered) {
      setCurrentImageIndex(0)
      setFadeIn(true)
    }
  }, [isHovered])

  return (
    <Card 
      className="bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
      onClick={() => router.push(`/paket/${pkg.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          key={currentImageIndex}
          src={pkg.images[currentImageIndex] || '/luxury-hotel.jpg'}
          alt={pkg.title}
          className={`w-full h-40 object-cover rounded-t-lg transition-opacity duration-300 ${
            fadeIn ? 'opacity-100' : 'opacity-0'
          }`}
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

        <CardTitle className="text-base mb-3 line-clamp-2">{pkg.title}</CardTitle>

        {/* Travel Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Calendar className="w-3 h-3 text-emerald-600" />
            <span>{formatDate(pkg.departureDate)}</span>
          </div>
          {pkg.travel?.city && (
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{pkg.travel.city}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Clock className="w-3 h-3 text-emerald-600" />
            <span>{pkg.duration} Hari</span>
          </div>
        </div>

        <Separator className="my-3" />

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Mulai dari</p>
              <p className="text-xl font-bold text-emerald-600">{formatPrice(lowestPrice)}</p>
              {pkg.pricingTiers[0]?.originalPrice && pkg.pricingTiers[0].originalPrice > lowestPrice && (
                <p className="text-xs text-gray-500 line-through">{formatPrice(pkg.pricingTiers[0].originalPrice)}</p>
              )}
            </div>
            {highestCashback > 0 && (
              <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs whitespace-nowrap">
                Cashback {formatPrice(highestCashback)}
              </Badge>
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
  )
}

export default function Home() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDuration, setSelectedDuration] = useState('')
  const [selectedBudget, setSelectedBudget] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [heroSlides, setHeroSlides] = useState<any[]>([])
  const [packages, setPackages] = useState<PackageWithTravel[]>([])
  const [loading, setLoading] = useState(true)
  const [travels, setTravels] = useState<any[]>([])
  const [blogArticles, setBlogArticles] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({
    siteName: 'Tripbaitullah',
    pageTitle: 'Tripbaitullah - Platform Umroh Terpercaya',
    logo: '/uploads/1762771904921-h15y0ji.png',
    footerLogo: '/uploads/1762771919359-zayvu3d.png',
    footerAbout: 'Platform terpercaya untuk menemukan paket umroh terbaik dari travel umroh berpengalaman.',
    footerPhone: '+62 812-3456-7890',
    footerEmail: 'info@tripbaitullah.com',
    footerAddress: 'Jakarta, Indonesia',
    footerCopyright: '© 2025 Tripbaitullah. All rights reserved.',
    packageDisplayOrder: 'random'
  })

  // Fetch hero slides, packages, travels, and settings from API
  // Fetch settings first, then other data
  useEffect(() => {
    const init = async () => {
      await fetchSettings()
      await fetchHeroSlides()
      await fetchTravels()
      await fetchBlogs()
    }
    init()
  }, [])

  // Fetch packages after settings are loaded
  useEffect(() => {
    if (settings.packageDisplayOrder) {
      fetchPackages()
    }
  }, [settings.packageDisplayOrder])

  // Update document title and favicon when settings change
  useEffect(() => {
    if (settings.pageTitle) {
      document.title = settings.pageTitle
    }
    
    // Update favicon
    if (settings.logo) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link')
      link.type = 'image/svg+xml'
      link.rel = 'icon'
      link.href = settings.logo
      if (!document.querySelector("link[rel*='icon']")) {
        document.head.appendChild(link)
      }
    }
  }, [settings.pageTitle, settings.logo])

  const fetchHeroSlides = async () => {
    try {
      const response = await fetch('/api/hero-slides')
      if (response.ok) {
        const data = await response.json()
        // Filter only active slides and sort by order
        const activeSlides = (data.data || [])
          .filter((slide: any) => slide.isActive)
          .sort((a: any, b: any) => a.order - b.order)
        setHeroSlides(activeSlides)
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error)
    }
  }

  // Shuffle array function for random display
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/packages?limit=100&status=active')
      const data = await response.json()
      let packages = data.data || []
      
      // Separate pinned and unpinned packages
      const pinnedPackages = packages.filter((pkg: any) => pkg.isPinned)
      const unpinnedPackages = packages.filter((pkg: any) => !pkg.isPinned)
      
      // Sort pinned packages by pinnedAt (oldest pin first = paling atas)
      pinnedPackages.sort((a: any, b: any) => {
        const timeA = a.pinnedAt ? new Date(a.pinnedAt).getTime() : 0
        const timeB = b.pinnedAt ? new Date(b.pinnedAt).getTime() : 0
        return timeA - timeB // Ascending: yang pertama di-pin muncul di atas
      })
      
      // Apply display order from settings to unpinned packages only
      if (settings.packageDisplayOrder === 'random') {
        unpinnedPackages.sort(() => Math.random() - 0.5)
      } else {
        // Default: newest first (sort by createdAt descending)
        unpinnedPackages.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      }
      
      // Combine: pinned packages first (sorted by pin time), then unpinned packages
      const allPackages = [...pinnedPackages, ...unpinnedPackages]
      
      // Take only first 4 for homepage
      setPackages(allPackages.slice(0, 4))
    } catch (error) {
      console.error('Error fetching packages:', error)
      setPackages([])
    } finally {
      setLoading(false)
    }
  }

  const fetchTravels = async () => {
    try {
      const response = await fetch('/api/travels?limit=4&status=active')
      const data = await response.json()
      setTravels(data.data || [])
    } catch (error) {
      console.error('Error fetching travels:', error)
      setTravels([])
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs?status=published&limit=4')
      if (response.ok) {
        const data = await response.json()
        setBlogArticles(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setBlogArticles([])
    }
  }

  // Helper function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const handleSearch = () => {
    // Build query parameters
    const params = new URLSearchParams()
    
    if (searchQuery) params.append('search', searchQuery)
    if (selectedBudget) params.append('budget', selectedBudget)
    if (selectedDuration) params.append('duration', selectedDuration)
    if (selectedMonth) params.append('month', selectedMonth)
    
    // Navigate to packages page with filters
    router.push(`/paket?${params.toString()}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Use hero slides from database, fallback to default if empty
  const slides = heroSlides.length > 0 ? heroSlides : [
    {
      image: '/kaaba-hero.jpg',
      title: 'Paket Umroh Premium',
      subtitle: 'Nikmati pengalaman spiritual yang tak terlupakan',
      description: 'Fasilitas bintang 5 dengan pelayanan terbaik'
    }
  ]

  // Calculate read time
  const calculateReadTime = (content: string) => {
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} menit baca`
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header Navigation */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/20 border-b border-white/20">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 flex items-center justify-center" suppressHydrationWarning>
                <Image 
                  src={settings.logo} 
                  alt={`${settings.siteName} Logo`} 
                  width={40} 
                  height={40} 
                  className="object-contain"
                  priority
                  suppressHydrationWarning
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {settings.siteName}
              </span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-emerald-600 transition-colors">Beranda</a>
              <a href="/paket" className="text-gray-700 hover:text-emerald-600 transition-colors">Paket Umroh</a>
              <a href="/travel" className="text-gray-700 hover:text-emerald-600 transition-colors">Travel Umroh</a>
              <a href="/blog" className="text-gray-700 hover:text-emerald-600 transition-colors">Blog</a>
              <Button 
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                onClick={() => window.open('https://wa.me/6282261252301?text=Halo,%20saya%20ingin%20konsultasi%20tentang%20paket%20umroh', '_blank')}
              >
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
                <a href="/" className="text-gray-700 hover:text-emerald-600 transition-colors">Beranda</a>
                <a href="/paket" className="text-gray-700 hover:text-emerald-600 transition-colors">Paket Umroh</a>
                <a href="/travel" className="text-gray-700 hover:text-emerald-600 transition-colors">Travel Umroh</a>
                <a href="/blog" className="text-gray-700 hover:text-emerald-600 transition-colors">Blog</a>
                <Button 
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  onClick={() => window.open('https://wa.me/6282261252301?text=Halo,%20saya%20ingin%20konsultasi%20tentang%20paket%20umroh', '_blank')}
                >
                  Hubungi Kami
                </Button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section with Slider */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                suppressHydrationWarning
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            {slides[currentSlide].title}
          </h1>
          {slides[currentSlide].subtitle && (
            <p className="text-xl md:text-2xl mb-4 text-white/90">
              {slides[currentSlide].subtitle}
            </p>
          )}
          {slides[currentSlide].description && (
            <p className="text-lg mb-8 text-white/80">
              {slides[currentSlide].description}
            </p>
          )}
          
          {/* CTA Button if available */}
          {slides[currentSlide].ctaText && slides[currentSlide].ctaLink && (
            <div className="mb-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                onClick={() => {
                  if (slides[currentSlide].ctaLink.startsWith('http')) {
                    window.open(slides[currentSlide].ctaLink, '_blank')
                  } else {
                    router.push(slides[currentSlide].ctaLink)
                  }
                }}
              >
                {slides[currentSlide].ctaText}
              </Button>
            </div>
          )}
          
          {/* Search Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Cari destinasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/60"
                />
              </div>
              <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                <SelectTrigger className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">Rp 20-25 Juta</SelectItem>
                  <SelectItem value="25">Rp 25-30 Juta</SelectItem>
                  <SelectItem value="30">Rp 30-35 Juta</SelectItem>
                  <SelectItem value="35">Rp 35 Juta+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
                  <SelectValue placeholder="Durasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Hari</SelectItem>
                  <SelectItem value="9">9 Hari</SelectItem>
                  <SelectItem value="10">10 Hari</SelectItem>
                  <SelectItem value="12">12 Hari</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="bg-white/20 backdrop-blur-sm border-white/30 text-white">
                  <SelectValue placeholder="Bulan Keberangkatan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="januari">Januari</SelectItem>
                  <SelectItem value="februari">Februari</SelectItem>
                  <SelectItem value="maret">Maret</SelectItem>
                  <SelectItem value="april">April</SelectItem>
                  <SelectItem value="mei">Mei</SelectItem>
                  <SelectItem value="juni">Juni</SelectItem>
                  <SelectItem value="juli">Juli</SelectItem>
                  <SelectItem value="agustus">Agustus</SelectItem>
                  <SelectItem value="september">September</SelectItem>
                  <SelectItem value="oktober">Oktober</SelectItem>
                  <SelectItem value="november">November</SelectItem>
                  <SelectItem value="desember">Desember</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                onClick={handleSearch}
              >
                Cari Paket
              </Button>
            </div>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Packages Section */}
      <section id="packages" className="py-20 px-4 bg-gradient-to-r from-emerald-100 to-green-100">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Paket Umroh Pilihan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pilih paket yang sesuai dengan kebutuhan dan budget Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                <p className="mt-4 text-gray-600">Memuat paket umroh...</p>
              </div>
            ) : packages.length > 0 ? (
              packages.map((pkg) => {
                const lowestPrice = Math.min(...pkg.pricingTiers.map(t => t.price))
                const highestCashback = Math.max(...pkg.pricingTiers.map(t => t.cashback || 0))
                
                return (
              <HomePackageCard
                key={pkg.id}
                pkg={pkg}
                lowestPrice={lowestPrice}
                highestCashback={highestCashback}
                formatPrice={formatPrice}
                formatDate={formatDate}
                router={router}
              />
                )
              })
            ) : (
              <div className="col-span-4 text-center py-12">
                <p className="text-gray-600">Belum ada paket umroh tersedia</p>
              </div>
            )}
          </div>
          
                  {/* Lihat Semua Button */}
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
              onClick={() => window.location.href = '/paket'}
            >
              Lihat Semua Paket
            </Button>
          </div>
        </div>
      </section>

      {/* Segera Berangkat Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Segera Berangkat
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Paket umroh yang akan berangkat dalam 7 hari ke depan. Buruan daftar sebelum kehabisan!
            </p>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-white/20 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Paket</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Travel</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Keberangkatan</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Durasi</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Kota</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Harga</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(() => {
                      const today = new Date()
                      const sevenDaysLater = new Date(today)
                      sevenDaysLater.setDate(today.getDate() + 7)
                      
                      // Filter packages that depart within 7 days
                      const urgentPackages = packages.filter(pkg => {
                        const departureDate = new Date(pkg.departureDate)
                        return departureDate >= today && departureDate <= sevenDaysLater
                      }).slice(0, 3) // Limit to 3 packages

                      if (urgentPackages.length === 0) {
                        return (
                          <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-gray-600">
                              Belum ada paket yang akan berangkat dalam 7 hari ke depan
                            </td>
                          </tr>
                        )
                      }

                      return urgentPackages.map((pkg) => {
                        const departureDate = new Date(pkg.departureDate)
                        const daysLeft = Math.ceil((departureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                        const sisaKuota = pkg.quota - pkg.bookedSeats
                        const isUrgent = sisaKuota <= 10
                        const maxCashback = Math.max(...pkg.pricingTiers.map((tier: any) => tier.cashback || 0))
                        
                        return (
                          <tr 
                            key={pkg.id} 
                            className="hover:bg-emerald-50 transition-colors cursor-pointer"
                            onClick={() => router.push(`/paket/${pkg.id}`)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">{pkg.title}</p>
                                  {daysLeft <= 3 && (
                                    <Badge className="mt-1 bg-red-500 text-white text-xs">
                                      🔥 {daysLeft} hari lagi
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {pkg.travel && (
                                <div className="flex items-center space-x-2">
                                  <img
                                    src={pkg.travel.logo || '/logo.svg'}
                                    alt={pkg.travel.name}
                                    className="w-8 h-8 object-contain rounded"
                                  />
                                  <span className="text-sm text-gray-900">{pkg.travel.name}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm text-gray-900">{formatDate(pkg.departureDate)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm text-gray-900">{pkg.duration} Hari</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm text-gray-900">{pkg.departureCity || pkg.travel?.city || 'Jakarta'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-lg font-bold text-emerald-600">{formatPrice(pkg.pricingTiers[0].price)}</p>
                                {maxCashback > 0 && (
                                  <Badge className="mt-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs">
                                    💰 Cashback {formatPrice(maxCashback)}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Button 
                                size="sm"
                                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/paket/${pkg.id}`)
                                }}
                              >
                                Daftar
                              </Button>
                            </td>
                          </tr>
                        )
                      })
                    })()}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Info Alert */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Perhatian!</p>
                <p>Paket di atas akan segera berangkat. Pastikan dokumen Anda sudah lengkap dan segera lakukan pembayaran untuk mengamankan kursi Anda.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Providers Section */}
      <section id="providers" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Travel Umroh Pilihan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Bekerja sama dengan travel penyelenggara umroh berpengalaman
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {travels.length > 0 ? (
              travels.map((travel) => (
                <Card 
                  key={travel.id} 
                  className="bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => router.push(`/travel/${travel.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-white shadow-sm">
                        <img 
                          src={travel.logo || '/logo.svg'} 
                          alt={travel.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1 mb-1">
                          <h3 className="font-semibold text-sm truncate">{travel.name}</h3>
                          {travel.verified && (
                            <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0.5 flex items-center space-x-0.5 flex-shrink-0">
                              <CheckCircle className="w-2.5 h-2.5" />
                              <span>Verified</span>
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{travel.city}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <p className="text-gray-600">Belum ada travel umroh tersedia</p>
              </div>
            )}
          </div>
          
          {/* Lihat Semua Button */}
          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
              onClick={() => window.location.href = '/travel'}
            >
              Lihat Semua Travel
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 px-4 bg-gradient-to-r from-emerald-100 to-green-100">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Blog & Artikel
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Wawasan dan tips bermanfaat untuk persiapan ibadah umroh Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogArticles.length > 0 ? blogArticles.map((article) => (
              <Card 
                key={article.id} 
                className="bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => router.push(`/blog/${article.id}`)}
              >
                <CardHeader className="p-0">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-emerald-600 text-white text-xs px-2 py-1">
                      {article.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{calculateReadTime(article.content)}</span>
                  </div>
                  <CardTitle className="text-base mb-2 line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {article.excerpt}
                  </CardDescription>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{article.author}</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white text-sm py-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/blog/${article.id}`)
                    }}
                  >
                    Baca Selengkapnya
                  </Button>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-4 text-center py-12 text-gray-500">
                Belum ada artikel tersedia
              </div>
            )}
          </div>
          
          {/* Lihat Semua Button */}
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
              onClick={() => window.location.href = '/blog'}
            >
              Lihat Semua Artikel
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Siap Untuk Perjalanan Suci mu?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Konsultasikan rencana umroh Anda dengan tim profesional kami
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="bg-white text-emerald-600 hover:bg-gray-100"
                onClick={() => window.open('https://wa.me/6282261252301?text=Halo,%20saya%20ingin%20konsultasi%20tentang%20paket%20umroh', '_blank')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Hubungi Kami
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 flex items-center justify-center" suppressHydrationWarning>
                  <Image 
                    src={settings.footerLogo} 
                    alt={`${settings.siteName} Logo`} 
                    width={40} 
                    height={40} 
                    className="object-contain"
                    suppressHydrationWarning
                  />
                </div>
                <span className="text-xl font-bold">{settings.siteName}</span>
              </div>
              <p className="text-gray-400">
                {settings.footerAbout}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Paket Umroh</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Travel Umroh</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Visa & Dokumen</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Asuransi</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Informasi</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{settings.footerPhone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{settings.footerEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{settings.footerAddress}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800" />

          <div className="text-center text-gray-400">
            <p>{settings.footerCopyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}