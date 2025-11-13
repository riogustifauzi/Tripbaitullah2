import AdminLayout from '@/components/admin/AdminLayout'
import PackageForm from '@/components/admin/forms/PackageForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { findById } from '@/lib/utils/data-access'
import { Package } from '@/types/package'

async function getPackage(id: string) {
  const pkg = await findById<Package>('packages.json', id)
  return pkg
}

export default async function EditPackagePage({ params }: { params: { id: string } }) {
  const pkg = await getPackage(params.id)

  if (!pkg) {
    notFound()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <Link 
            href="/paneladmin/packages"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Daftar Paket
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Paket Umroh</h1>
          <p className="text-gray-600 mt-1">Edit data {pkg.title}</p>
        </div>

        <PackageForm mode="edit" initialData={pkg} />
      </div>
    </AdminLayout>
  )
}
