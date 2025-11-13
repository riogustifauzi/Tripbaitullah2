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
import { Plus, Edit, Trash2, Eye, CheckCircle } from 'lucide-react'
import { Travel } from '@/types/travel'

export default function TravelsPage() {
  const router = useRouter()
  const [travels, setTravels] = useState<Travel[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchTravels()
  }, [currentPage, pageSize, searchQuery, filters])

  const fetchTravels = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...filters
      })

      const response = await fetch(`/api/travels?${params}`)
      const data = await response.json()

      setTravels(data.data)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Error fetching travels:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus travel umroh ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/travels/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchTravels()
      } else {
        const error = await response.json()
        alert(error.error.message)
      }
    } catch (error) {
      console.error('Error deleting travel:', error)
      alert('Gagal menghapus travel umroh')
    }
  }

  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ]

  const columns: Column<Travel>[] = [
    {
      key: 'no',
      label: 'No',
      render: (travel, index) => (
        <span className="font-medium text-gray-700">
          {(currentPage - 1) * pageSize + (index || 0) + 1}
        </span>
      )
    },
    {
      key: 'logo',
      label: 'Logo',
      render: (travel) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={travel.logo || '/logo.svg'}
            alt={travel.name}
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
      )
    },
    {
      key: 'name',
      label: 'Nama',
      sortable: true,
      render: (travel) => (
        <div>
          <p className="font-medium text-gray-900">{travel.name}</p>
          <p className="text-sm text-gray-500">{travel.city}</p>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Kontak',
      render: (travel) => (
        <div className="text-sm">
          <p className="text-gray-900">{travel.email}</p>
          <p className="text-gray-500">{travel.phone}</p>
        </div>
      )
    },
    {
      key: 'verified',
      label: 'Status Verifikasi',
      sortable: true,
      render: (travel) => (
        <Badge className={travel.verified ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}>
          {travel.verified ? (
            <span className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Verified</span>
            </span>
          ) : (
            <span>Not Verified</span>
          )}
        </Badge>
      )
    },
    {
      key: 'totalPackages',
      label: 'Paket',
      sortable: true,
      render: (travel) => (
        <span className="font-medium">{travel.totalPackages}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (travel) => (
        <Badge className={travel.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
          {travel.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (travel) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/travel/${travel.id}`, '_blank')}
            title="Lihat di halaman publik"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/paneladmin/travels/${travel.id}/edit`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(travel.id)}
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
            <h1 className="text-3xl font-bold text-gray-900">Travel Umroh</h1>
            <p className="text-gray-600 mt-1">Kelola data travel penyelenggara umroh</p>
          </div>
          <Link href="/paneladmin/travels/new">
            <Button className="bg-gradient-to-r from-emerald-600 to-green-600">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Travel
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <SearchFilter
          searchPlaceholder="Cari travel umroh..."
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
              data={travels}
              keyExtractor={(travel) => travel.id}
              emptyMessage="Belum ada travel umroh"
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
