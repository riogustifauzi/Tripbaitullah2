'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, Star } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface Package {
  id: number
  title: string
  provider: string
  providerLogo: string
  price: string
  originalPrice: string
  cashback: string
  rating: number
  reviews: number
  images: string[]
  badge: string
  departureDate: string
  departureCity: string
  duration: string
}

function PackageCardWithSlider({ pkg }: { pkg: Package }) {
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
      className="bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = `/paket/${pkg.id}`}
    >
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-emerald-600 to-green-600">
            {pkg.badge}
          </Badge>
        </div>
        <img
          key={currentImageIndex}
          src={pkg.images[currentImageIndex]}
          alt={pkg.title}
          className={`w-full h-48 object-cover rounded-t-lg transition-opacity duration-300 ${
            fadeIn ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
      <CardContent className="p-4">
        {/* Travel Provider */}
        <div className="flex items-center space-x-3 mb-3">
          <img
            src={pkg.providerLogo}
            alt={pkg.provider}
            className="w-10 h-10 object-contain rounded-lg bg-white p-1 shadow-sm"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-1">
              <h3 className="font-bold text-gray-900 text-sm">{pkg.provider}</h3>
              <Badge className="bg-blue-500 text-white text-xs px-1">✓</Badge>
            </div>
          </div>
        </div>

        <CardTitle className="text-lg mb-3">{pkg.title}</CardTitle>
        
        {/* Travel Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{pkg.departureDate}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>{pkg.departureCity}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{pkg.duration}</span>
          </div>
        </div>

        <Separator className="my-3" />

        {/* Price */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-emerald-600">{pkg.price}</p>
              <p className="text-xs text-gray-500 line-through">{pkg.originalPrice}</p>
            </div>
            <Badge className="bg-red-500 text-white text-xs">
              Cashback {pkg.cashback}
            </Badge>
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
            onClick={(e) => {
              e.stopPropagation()
              window.location.href = `/paket/${pkg.id}`
            }}
          >
            Lihat Detail
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function RelatedPackages() {
  const relatedPackages: Package[] = [
    {
      id: 2,
      title: 'Umroh Plus Turki 12 Hari',
      provider: 'Travel Nurul Iman',
      providerLogo: '/logo-nuruliman.png',
      price: 'Rp 35.000.000',
      originalPrice: 'Rp 36.000.000',
      cashback: 'Rp 1.000.000',
      rating: 4.9,
      reviews: 189,
      images: ['/luxury-hotel.jpg', '/luxury-hotel.jpg', '/luxury-hotel.jpg'],
      badge: 'Premium',
      departureDate: '20 Desember 2024',
      departureCity: 'Surabaya',
      duration: '12 Hari 11 Malam'
    },
    {
      id: 3,
      title: 'Umroh Ramadhan 10 Hari',
      provider: 'Travel Al-Madinah',
      providerLogo: '/logo-almadinah.png',
      price: 'Rp 28.500.000',
      originalPrice: 'Rp 29.500.000',
      cashback: 'Rp 1.000.000',
      rating: 4.7,
      reviews: 156,
      images: ['/luxury-hotel.jpg', '/luxury-hotel.jpg', '/luxury-hotel.jpg'],
      badge: 'Ramadhan Special',
      departureDate: '1 Maret 2025',
      departureCity: 'Medan',
      duration: '10 Hari 9 Malam'
    },
    {
      id: 4,
      title: 'Umroh Ekonomis 7 Hari',
      provider: 'Travel Cahaya Islam',
      providerLogo: '/logo-almadinah.png',
      price: 'Rp 18.500.000',
      originalPrice: 'Rp 19.500.000',
      cashback: 'Rp 1.000.000',
      rating: 4.6,
      reviews: 98,
      images: ['/luxury-hotel.jpg', '/luxury-hotel.jpg', '/luxury-hotel.jpg'],
      badge: 'Ekonomis',
      departureDate: '10 Januari 2025',
      departureCity: 'Bandung',
      duration: '7 Hari 6 Malam'
    }
  ]

  return (
    <div className="py-12 px-4 bg-gradient-to-r from-emerald-100 to-green-100">
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
            <PackageCardWithSlider key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </div>
  )
}
