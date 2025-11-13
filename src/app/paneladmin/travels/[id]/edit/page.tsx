import AdminLayout from '@/components/admin/AdminLayout'
import TravelForm from '@/components/admin/forms/TravelForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { findById } from '@/lib/utils/data-access'
import { Travel } from '@/types/travel'

async function getTravel(id: string) {
  const travel = await findById<Travel>('travels.json', id)
  return travel
}

export default async function EditTravelPage({ params }: { params: { id: string } }) {
  const travel = await getTravel(params.id)

  if (!travel) {
    notFound()
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Travel Umroh</h1>
          <p className="text-gray-600 mt-1">Edit data {travel.name}</p>
        </div>

        {/* Form */}
        <TravelForm mode="edit" initialData={travel} />
      </div>
    </AdminLayout>
  )
}
