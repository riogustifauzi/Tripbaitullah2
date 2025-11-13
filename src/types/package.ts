import { Travel } from './travel'

export interface PricingTier {
  name: string
  price: number
  originalPrice?: number // Harga coret
  cashback?: number // Cashback
  hotelMakkah: string
  hotelMadinah: string
  roomType: string
  additionalFacilities: string[]
  isPopular?: boolean // Tier paling populer
}

export interface ItineraryDay {
  day: number
  title: string
  activities: string[]
}

export interface Package {
  id: string
  title: string
  slug: string
  travelId: string
  travel?: Travel
  description: string
  duration: number
  departureDate: string
  returnDate: string
  departureCity?: string // Kota keberangkatan
  quota: number
  bookedSeats: number
  airline?: string // Nama maskapai
  flightType?: 'Langsung' | 'Transit' // Tipe penerbangan
  pricingTiers: PricingTier[]
  facilities: string[]
  excludedFacilities?: string[] // Fasilitas tidak termasuk
  itinerary: ItineraryDay[]
  images: string[]
  status: 'active' | 'draft'
  isPinned?: boolean // Paket disematkan (muncul di atas)
  pinnedAt?: string // Waktu paket disematkan (untuk urutan)
  createdAt: string
  updatedAt: string
}

export interface PackageFormData {
  title: string
  travelId: string
  description: string
  duration: number
  departureDate: Date
  returnDate: Date
  departureCity?: string
  quota?: number
  airline?: string
  flightType?: 'Langsung' | 'Transit'
  pricingTiers: PricingTier[]
  facilities: string[]
  excludedFacilities?: string[]
  itinerary: ItineraryDay[]
  images: (File | string)[]
  status: 'active' | 'draft'
}
