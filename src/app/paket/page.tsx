'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Search, Calendar, MapPin, Clock, Heart, Phone, Mail, 
  Menu, X, Filter, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Package } from '@/types/package'
import { Travel } from '@/types/travel'

interface PackageWithTravel extends Package {
  travel?: Travel
}

interface PackageCardItemProps {
  pkg: PackageWithTravel
  lowestPrice: number
  highestCashback: number
  formatPrice: (price: number) => string
  formatDate: (date: string) => string
  router: any
}

function PackageCardItem({ pkg, lowestPrice, highestCashback, formatPrice, formatDate, router }: PackageCardItemProps) {
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

export default function AllPackages() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [allPackages, setAllPackages] = useState<PackageWithTravel[]>([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<any>({
    siteName: 'Tripbaitullah',
    pageTitle: 'Tripbaitullah - Platform Umroh Terpercaya',
    logo: '/uploads/1762771904921-h15y0ji.png',
    footerLogo: '/uploads/1762771919359-zayvu3d.png',
    footerAbout: 'Platform terpercaya untuk menemukan paket umroh terbaik dari travel umroh berpengalaman.',
    footerPhone: '+62 812-3456-7890',
    footerEmail: 'info@tripbaitullah.com',
    footerAddress: 'Jakarta, Indonesia',
    footerCopyright: '© 2024 Tripbaitullah. All rights reserved.'
  })

  // Update document title when settings change
  useEffect(() => {
    if (settings.pageTitle) {
      document.title = settings.pageTitle
    }
  }, [settings.pageTitle])
  
  // Get URL search params
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const [searchQuery, setSearchQuery] = useState(urlParams?.get('search') || '')
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState(urlParams?.get('month') || 'all')
  const [selectedDuration, setSelectedDuration] = useState(urlParams?.get('duration') || 'all')
  const [priceRange, setPriceRange] = useState(() => {
    const budget = urlParams?.get('budget')
    if (budget === '20') return [20000000, 25000000]
    if (budget === '25') return [25000000, 30000000]
    if (budget === '30') return [30000000, 35000000]
    if (budget === '35') return [35000000, 50000000]
    return [0, 50000000]
  })
  const [sortBy, setSortBy] = useState('default')

  // Fetch settings first, then packages
  useEffect(() => {
    const init = async () => {
      await fetchSettings()
      await fetchPackages()
    }
    init()
  }, [])

  // Refetch packages when settings change (for random order)
  useEffect(() => {
    if (settings.packageDisplayOrder) {
      fetchPackages()
    }
  }, [settings.packageDisplayOrder])

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
      const pinnedPackages = packages.filter((pkg: PackageWithTravel) => pkg.isPinned)
      const unpinnedPackages = packages.filter((pkg: PackageWithTravel) => !pkg.isPinned)
      
      // Sort pinned packages by pinnedAt (oldest pin first = paling atas)
      pinnedPackages.sort((a: PackageWithTravel, b: PackageWithTravel) => {
        const timeA = a.pinnedAt ? new Date(a.pinnedAt).getTime() : 0
        const timeB = b.pinnedAt ? new Date(b.pinnedAt).getTime() : 0
        return timeA - timeB // Ascending: yang pertama di-pin muncul di atas
      })
      
      // Apply display order from settings to unpinned packages only
      if (settings.packageDisplayOrder === 'random') {
        unpinnedPackages.sort(() => Math.random() - 0.5)
      } else {
        // Default: newest first (sort by createdAt descending)
        unpinnedPackages.sort((a: PackageWithTravel, b: PackageWithTravel) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      }
      
      // Combine: pinned packages first (sorted by pin time), then unpinned packages
      setAllPackages([...pinnedPackages, ...unpinnedPackages])
    } catch (error) {
      console.error('Error fetching packages:', error)
      setAllPackages([])
    } finally {
      setLoading(false)
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

  // Helper function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Helper function to get month name
  const getMonthName = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { month: 'long' })
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

  // Get unique cities and months for filters
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(
      allPackages
        .map(p => p.travel?.city)
        .filter(Boolean)
    ))
    return ['all', ...uniqueCities]
  }, [allPackages])

  const months = useMemo(() => {
    const uniqueMonths = Array.from(new Set(
      allPackages.map(p => getMonthName(p.departureDate))
    ))
    return ['all', ...uniqueMonths]
  }, [allPackages])



  // Filter and sort packages
  const filteredPackages = useMemo(() => {
    let filtered = allPackages.filter(pkg => {
      // Get the lowest price from pricing tiers
      const lowestPrice = Math.min(...pkg.pricingTiers.map(t => t.price))
      
      // Search filter
      const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (pkg.travel?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      
      // City filter
      const matchesCity = selectedCity === 'all' || pkg.travel?.city === selectedCity
      
      // Month filter
      const matchesMonth = selectedMonth === 'all' || getMonthName(pkg.departureDate) === selectedMonth
      
      // Duration filter
      const matchesDuration = selectedDuration === 'all' || 
                             (selectedDuration === '7' && pkg.duration <= 7) ||
                             (selectedDuration === '9' && pkg.duration >= 8 && pkg.duration <= 10) ||
                             (selectedDuration === '12' && pkg.duration >= 11 && pkg.duration <= 13) ||
                             (selectedDuration === '14' && pkg.duration >= 14)
      
      // Price filter
      const matchesPrice = lowestPrice >= priceRange[0] && lowestPrice <= priceRange[1]
      
      return matchesSearch && matchesCity && matchesMonth && matchesDuration && matchesPrice
    })

    // Sort packages based on user selection or default setting
    switch (sortBy) {
      case 'newest':
        // Sort by creation date (newest first)
        filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = Math.min(...a.pricingTiers.map(t => t.price))
          const priceB = Math.min(...b.pricingTiers.map(t => t.price))
          return priceA - priceB
        })
        break
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = Math.min(...a.pricingTiers.map(t => t.price))
          const priceB = Math.min(...b.pricingTiers.map(t => t.price))
          return priceB - priceA
        })
        break
      case 'departure-soon':
        // Sort by departure date (soonest first)
        filtered.sort((a, b) => 
          new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
        )
        break
      case 'default':
      default:
        // Keep the order from allPackages (which already applied settings from fetchPackages)
        // This maintains the order based on packageDisplayOrder setting (newest or random)
        break
    }

    return filtered
  }, [allPackages, searchQuery, selectedCity, selectedMonth, selectedDuration, priceRange, sortBy])

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCity('all')
    setSelectedMonth('all')
    setSelectedDuration('all')
    setPriceRange([0, 50000000])
    setSortBy('default')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header Navigation */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/20 border-b border-white/20">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
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
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-emerald-600 transition-colors">Beranda</a>
              <a href="/paket" className="text-emerald-600 font-semibold">Paket Umroh</a>
              <a href="/travel" className="text-gray-700 hover:text-emerald-600 transition-colors">Travel Umroh</a>
              <a href="/blog" className="text-gray-700 hover:text-emerald-600 transition-colors">Blog</a>
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
                <a href="/" className="text-gray-700 hover:text-emerald-600 transition-colors">Beranda</a>
                <a href="/paket" className="text-emerald-600 font-semibold">Paket Umroh</a>
                <a href="/travel" className="text-gray-700 hover:text-emerald-600 transition-colors">Travel Umroh</a>
                <a href="/blog" className="text-gray-700 hover:text-emerald-600 transition-colors">Blog</a>
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
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Semua Paket Umroh
            </h1>
            <p className="text-gray-600 text-lg">
              Temukan paket umroh yang sesuai dengan kebutuhan dan budget Anda
            </p>
          </div>

          {/* Mobile Search Bar */}
          <Card className="bg-white/90 backdrop-blur-sm border-white/20 mb-8 lg:hidden">
            <CardContent className="p-4">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Cari paket atau travel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kota</SelectItem>
                    {cities.filter(c => c !== 'all').map(city => (
                      <SelectItem key={city} value={city || ''}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader className="space-y-3 pb-6 border-b">
                      <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        Filter Lanjutan
                      </SheetTitle>
                      <SheetDescription className="text-base">
                        Sesuaikan pencarian paket umroh Anda
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="space-y-6 mt-6 px-1">
                      <div className="space-y-3">
                        <Label>Bulan Keberangkatan</Label>
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                          <SelectTrigger>
                            <SelectValue placeholder="Bulan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua Bulan</SelectItem>
                            {months.filter(m => m !== 'all').map(month => (
                              <SelectItem key={month} value={month}>{month}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label>Durasi</Label>
                        <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                          <SelectTrigger>
                            <SelectValue placeholder="Durasi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua Durasi</SelectItem>
                            <SelectItem value="7">≤ 7 Hari</SelectItem>
                            <SelectItem value="9">8-10 Hari</SelectItem>
                            <SelectItem value="12">11-13 Hari</SelectItem>
                            <SelectItem value="14">≥ 14 Hari</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <Label>Rentang Harga</Label>
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
                          <div className="text-center mb-4">
                            <span className="text-lg font-bold text-emerald-700">
                              Rp {(priceRange[0] / 1000000).toFixed(1)}jt - Rp {(priceRange[1] / 1000000).toFixed(1)}jt
                            </span>
                          </div>
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            min={0}
                            max={50000000}
                            step={1000000}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <Label>Urutkan</Label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="newest">Terbaru</SelectItem>
                            <SelectItem value="price-low">Harga Terendah</SelectItem>
                            <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                            <SelectItem value="departure-soon">Keberangkatan Tercepat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                        onClick={resetFilters}
                      >
                        Reset Filter
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </CardContent>
          </Card>

          {/* Desktop Layout: Sidebar Filter + Packages */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left: Filter Sidebar (Desktop Only) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <Card className="bg-white/90 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Filter Pencarian</h3>
                    
                    {/* Search */}
                    <div className="space-y-4 mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Cari paket..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* City Filter */}
                    <div className="space-y-3 mb-6">
                      <Label className="text-sm font-semibold text-gray-900">Kota Keberangkatan</Label>
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kota" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Kota</SelectItem>
                          {cities.filter(c => c !== 'all').map(city => (
                            <SelectItem key={city} value={city || ''}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="my-6" />

                    {/* Month Filter */}
                    <div className="space-y-3 mb-6">
                      <Label className="text-sm font-semibold text-gray-900">Bulan Keberangkatan</Label>
                      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Bulan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Bulan</SelectItem>
                          {months.filter(m => m !== 'all').map(month => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="my-6" />

                    {/* Duration Filter */}
                    <div className="space-y-3 mb-6">
                      <Label className="text-sm font-semibold text-gray-900">Durasi Perjalanan</Label>
                      <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Durasi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Durasi</SelectItem>
                          <SelectItem value="7">≤ 7 Hari</SelectItem>
                          <SelectItem value="9">8-10 Hari</SelectItem>
                          <SelectItem value="12">11-13 Hari</SelectItem>
                          <SelectItem value="14">≥ 14 Hari</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="my-6" />

                    {/* Price Range */}
                    <div className="space-y-4 mb-6">
                      <Label className="text-sm font-semibold text-gray-900">Rentang Harga</Label>
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
                        <div className="text-center mb-4">
                          <span className="text-sm font-bold text-emerald-700">
                            Rp {(priceRange[0] / 1000000).toFixed(1)}jt - Rp {(priceRange[1] / 1000000).toFixed(1)}jt
                          </span>
                        </div>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          min={0}
                          max={50000000}
                          step={1000000}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Reset Button */}
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                      onClick={resetFilters}
                    >
                      Reset Semua Filter
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right: Packages Grid */}
            <div className="lg:col-span-3">
              {/* Results Info */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  Menampilkan <span className="font-semibold text-emerald-600">{filteredPackages.length}</span> paket umroh
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="price-low">Harga Terendah</SelectItem>
                    <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                    <SelectItem value="departure-soon">Keberangkatan Tercepat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Packages Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  <p className="mt-4 text-gray-600">Memuat paket umroh...</p>
                </div>
              ) : filteredPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPackages.map((pkg) => {
                    const lowestPrice = Math.min(...pkg.pricingTiers.map(t => t.price))
                    const highestCashback = Math.max(...pkg.pricingTiers.map(t => t.cashback || 0))
                    
                    return (
                      <PackageCardItem 
                        key={pkg.id}
                        pkg={pkg}
                        lowestPrice={lowestPrice}
                        highestCashback={highestCashback}
                        formatPrice={formatPrice}
                        formatDate={formatDate}
                        router={router}
                      />
                    )
                  })}
                </div>
              ) : (
                <Card className="bg-white/90 backdrop-blur-sm border-white/20">
                  <CardContent className="p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <Search className="w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        Tidak ada paket ditemukan
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Coba ubah filter pencarian Anda
                      </p>
                      <Button 
                        variant="outline"
                        onClick={resetFilters}
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        Reset Filter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

          </div>
        </div>
      </div>

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
                <li><a href="/paket" className="hover:text-white transition-colors">Paket Umroh</a></li>
                <li><a href="/travel" className="hover:text-white transition-colors">Travel Umroh</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Visa & Dokumen</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Asuransi</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Informasi</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
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
