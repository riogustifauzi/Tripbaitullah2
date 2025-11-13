export interface HeroSlide {
  id: string
  image: string
  title: string
  subtitle?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface HeroSlideFormData {
  image: File | string
  title: string
  subtitle?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  isActive: boolean
}
