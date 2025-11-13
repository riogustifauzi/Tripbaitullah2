import AdminLayout from '@/components/admin/AdminLayout'
import BlogForm from '@/components/admin/forms/BlogForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewBlogPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <Link 
            href="/paneladmin/content"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Daftar Artikel
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Artikel</h1>
          <p className="text-gray-600 mt-1">Buat artikel atau konten baru</p>
        </div>

        <BlogForm mode="create" />
      </div>
    </AdminLayout>
  )
}
