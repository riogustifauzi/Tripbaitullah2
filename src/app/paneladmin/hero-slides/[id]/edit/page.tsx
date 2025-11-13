import AdminLayout from '@/components/admin/AdminLayout'
import HeroSlideForm from '@/components/admin/forms/HeroSlideForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { findById } from '@/lib/utils/data-access'
import { HeroSlide } from '@/types/hero-slide'

async function getHeroSlide(id: string) {
  const slide = await findById<HeroSlide>('hero-slides.json', id)
  return slide
}

export default async function EditHeroSlidePage({ params }: { params: { id: string } }) {
  const slide = await getHeroSlide(params.id)

  if (!slide) {
    notFound()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <Link 
            href="/paneladmin/hero-slides"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Daftar Slides
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Hero Slide</h1>
          <p className="text-gray-600 mt-1">Edit {slide.title}</p>
        </div>

        <HeroSlideForm mode="edit" initialData={slide} />
      </div>
    </AdminLayout>
  )
}
