'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchFilter, { FilterOption } from '@/components/admin/SearchFilter'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Blog } from '@/types/blog'

export default function ContentPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchBlogs()
  }, [currentPage, pageSize, searchQuery, filters])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...filters
      })

      const response = await fetch(`/api/blogs?${params}`)
      const data = await response.json()

      setBlogs(data.data)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchBlogs()
      } else {
        const error = await response.json()
        alert(error.error.message)
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      alert('Gagal menghapus artikel')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'published', label: 'Published' },
        { value: 'draft', label: 'Draft' }
      ]
    },
    {
      key: 'category',
      label: 'Kategori',
      options: [
        { value: 'Tips', label: 'Tips' },
        { value: 'Panduan', label: 'Panduan' },
        { value: 'Berita', label: 'Berita' },
        { value: 'Inspirasi', label: 'Inspirasi' }
      ]
    }
  ]

  const columns: Column<Blog>[] = [
    {
      key: 'featuredImage',
      label: 'Gambar',
      render: (blog) => (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={blog.featuredImage || '/logo.svg'}
            alt={blog.title}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>
      )
    },
    {
      key: 'title',
      label: 'Judul',
      sortable: true,
      render: (blog) => (
        <div>
          <p className="font-medium text-gray-900 line-clamp-2">{blog.title}</p>
          <p className="text-sm text-gray-500 mt-1">{blog.category}</p>
        </div>
      )
    },
    {
      key: 'author',
      label: 'Penulis',
      sortable: true,
      render: (blog) => (
        <span className="text-sm">{blog.author}</span>
      )
    },
    {
      key: 'publishedAt',
      label: 'Tanggal',
      sortable: true,
      render: (blog) => (
        <span className="text-sm">{formatDate(blog.publishedAt)}</span>
      )
    },
    {
      key: 'views',
      label: 'Views',
      sortable: true,
      render: (blog) => (
        <span className="text-sm font-medium">{blog.views.toLocaleString()}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (blog) => (
        <Badge className={blog.status === 'published' ? 'bg-green-500' : 'bg-gray-500'}>
          {blog.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (blog) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/paneladmin/content/${blog.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/paneladmin/content/${blog.id}/edit`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(blog.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content & Blog</h1>
            <p className="text-gray-600 mt-1">Kelola artikel dan konten website</p>
          </div>
          <Link href="/paneladmin/content/new">
            <Button className="bg-gradient-to-r from-emerald-600 to-green-600">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Artikel
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <SearchFilter
          searchPlaceholder="Cari artikel..."
          onSearchChange={setSearchQuery}
          filters={filterOptions}
          onFilterChange={(key, value) => setFilters({ ...filters, [key]: value })}
          onClearFilters={() => {
            setSearchQuery('')
            setFilters({})
          }}
        />

        {/* Data Table */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={blogs}
              keyExtractor={(blog) => blog.id}
              emptyMessage="Belum ada artikel"
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          </>
        )}
      </div>
    </AdminLayout>
  )
}
