import AdminLayout from '@/components/admin/AdminLayout'
import PackageForm from '@/components/admin/forms/PackageForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewPackagePage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Tambah Paket Umroh</h1>
          <p className="text-gray-600 mt-1">Tambahkan paket umroh baru</p>
        </div>

        <PackageForm mode="create" />
      </div>
    </AdminLayout>
  )
}
