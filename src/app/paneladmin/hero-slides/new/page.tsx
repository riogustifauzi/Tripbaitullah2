import AdminLayout from '@/components/admin/AdminLayout'
import HeroSlideForm from '@/components/admin/forms/HeroSlideForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewHeroSlidePage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Tambah Hero Slide</h1>
          <p className="text-gray-600 mt-1">Tambahkan slide baru untuk hero section</p>
        </div>

        <HeroSlideForm mode="create" />
      </div>
    </AdminLayout>
  )
}
