import AdminLayout from '@/components/admin/AdminLayout'
import BlogForm from '@/components/admin/forms/BlogForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { findById } from '@/lib/utils/data-access'
import { Blog } from '@/types/blog'

async function getBlog(id: string) {
  const blog = await findById<Blog>('blogs.json', id)
  return blog
}

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const blog = await getBlog(params.id)

  if (!blog) {
    notFound()
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Artikel</h1>
          <p className="text-gray-600 mt-1">Edit {blog.title}</p>
        </div>

        <BlogForm mode="edit" initialData={blog} />
      </div>
    </AdminLayout>
  )
}
