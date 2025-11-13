'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Package } from '@/types/package'
import { Travel } from '@/types/travel'

interface PackageWithTravel extends Package {
  travel?: Travel
}

interface PackageCardProps {
  pkg: PackageWithTravel
  formatPrice: (price: number) => string
  formatDate: (date: string) => string
}

export default function PackageCard({ pkg, formatPrice, formatDate }: PackageCardProps) {
  const router = useRouter()
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

  const lowestPrice = Math.min(...pkg.pricingTiers.map(t => t.price))
  const highestCashback = Math.max(...pkg.pricingTiers.map(t => t.cashback || 0))

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
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <MapPin className="w-3 h-3 text-emerald-600" />
            <span>{pkg.departureCity || pkg.travel?.city || 'Jakarta'}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Clock className="w-3 h-3 text-emerald-600" />
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
                <p className="text-lg font-bold text-emerald-600">
                  {formatPrice(lowestPrice)}
                </p>
                {pkg.pricingTiers[0].originalPrice && pkg.pricingTiers[0].originalPrice > lowestPrice && (
                  <p className="text-xs text-gray-500 line-through">
                    {formatPrice(pkg.pricingTiers[0].originalPrice)}
                  </p>
                )}
              </div>
              {highestCashback > 0 && (
                <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs">
                  Cashback {formatPrice(highestCashback)}
                </Badge>
              )}
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
  )
}
