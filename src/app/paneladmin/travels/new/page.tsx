import AdminLayout from '@/components/admin/AdminLayout'
import TravelForm from '@/components/admin/forms/TravelForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewTravelPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link 
            href="/paneladmin/travels"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Daftar Travel
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Travel Umroh</h1>
          <p className="text-gray-600 mt-1">Tambahkan travel penyelenggara umroh baru</p>
        </div>

        {/* Form */}
        <TravelForm mode="create" />
      </div>
    </AdminLayout>
  )
}
