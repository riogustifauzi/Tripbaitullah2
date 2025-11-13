export interface Certification {
  name: string
  number: string
}

export interface Achievement {
  year: string
  title: string
  organization: string
}

export interface GalleryImage {
  id: string
  url: string
  title: string
  description: string
}

export interface Travel {
  id: string
  name: string
  slug: string
  logo: string
  city: string
  address: string
  phone: string
  email: string
  website?: string
  description: string
  certifications: string[]
  rating: number
  totalPackages: number
  status: 'active' | 'inactive'
  verified?: boolean
  createdAt: string
  updatedAt: string
  // Extended fields
  tagline?: string
  experience?: string
  facilities?: string[]
  detailedCertifications?: Certification[]
  achievements?: Achievement[]
  gallery?: GalleryImage[]
}

export interface TravelFormData {
  name: string
  logo: File | string
  city: string
  address: string
  phone: string
  email: string
  website?: string
  description: string
  certifications: string[]
  rating: number
  status: 'active' | 'inactive'
  verified?: boolean
  // Extended fields
  tagline?: string
  experience?: string
  facilities?: string[]
  detailedCertifications?: Certification[]
  achievements?: Achievement[]
  gallery?: GalleryImage[]
}
