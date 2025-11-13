'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable, { Column } from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import SearchFilter, { FilterOption } from '@/components/admin/SearchFilter'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, Calendar, Pin } from 'lucide-react'
import { Package } from '@/types/package'

export default function PackagesPage() {
  const router = useRouter()
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchPackages()
  }, [currentPage, pageSize, searchQuery, filters])

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...filters
      })

      const response = await fetch(`/api/packages?${params}`)
      const data = await response.json()

      setPackages(data.data)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchPackages()
      } else {
        const error = await response.json()
        alert(error.error.message)
      }
    } catch (error) {
      console.error('Error deleting package:', error)
      alert('Gagal menghapus paket')
    }
  }

  const handleTogglePin = async (id: string) => {
    try {
      const response = await fetch(`/api/packages/${id}/pin`, {
        method: 'POST'
      })

      if (response.ok) {
        fetchPackages()
      } else {
        const error = await response.json()
        alert(error.error.message)
      }
    } catch (error) {
      console.error('Error toggling pin:', error)
      alert('Gagal mengubah status sematkan')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'draft', label: 'Draft' }
      ]
    }
  ]

  const columns: Column<Package>[] = [
    {
      key: 'no',
      label: 'No',
      render: (pkg, index) => (
        <span className="text-sm text-gray-600">
          {(currentPage - 1) * pageSize + (index || 0) + 1}
        </span>
      )
    },
    {
      key: 'title',
      label: 'Paket',
      sortable: true,
      render: (pkg) => (
        <div className="flex items-center space-x-2">
          {pkg.isPinned && (
            <Pin className="w-4 h-4 text-emerald-600 fill-emerald-600" />
          )}
          <p className="font-medium text-gray-900">{pkg.title}</p>
        </div>
      )
    },
    {
      key: 'travel',
      label: 'Nama Travel',
      sortable: true,
      render: (pkg) => (
        <span className="text-sm text-gray-700">{pkg.travel?.name || 'N/A'}</span>
      )
    },
    {
      key: 'departureDate',
      label: 'Keberangkatan',
      sortable: true,
      render: (pkg) => (
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{formatDate(pkg.departureDate)}</span>
        </div>
      )
    },
    {
      key: 'duration',
      label: 'Durasi',
      sortable: true,
      render: (pkg) => (
        <span className="text-sm">{pkg.duration} hari</span>
      )
    },
    {
      key: 'pricingTiers',
      label: 'Harga',
      render: (pkg) => {
        const minPrice = Math.min(...pkg.pricingTiers.map(t => t.price))
        const maxPrice = Math.max(...pkg.pricingTiers.map(t => t.price))
        return (
          <div className="text-sm">
            <p className="font-semibold text-emerald-600">
              {formatPrice(minPrice)}
            </p>
            {minPrice !== maxPrice && (
              <p className="text-xs text-gray-500">
                s/d {formatPrice(maxPrice)}
              </p>
            )}
          </div>
        )
      }
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (pkg) => (
        <Badge className={pkg.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
          {pkg.status}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (pkg) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTogglePin(pkg.id)}
            className={pkg.isPinned ? 'text-emerald-600 border-emerald-600' : ''}
            title={pkg.isPinned ? 'Lepas Sematkan' : 'Sematkan'}
          >
            <Pin className={`w-4 h-4 ${pkg.isPinned ? 'fill-emerald-600' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/paneladmin/packages/${pkg.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/paneladmin/packages/${pkg.id}/edit`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(pkg.id)}
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
            <h1 className="text-3xl font-bold text-gray-900">Paket Umroh</h1>
            <p className="text-gray-600 mt-1">Kelola data paket umroh</p>
          </div>
          <Link href="/paneladmin/packages/new">
            <Button className="bg-gradient-to-r from-emerald-600 to-green-600">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Paket
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <SearchFilter
          searchPlaceholder="Cari paket umroh..."
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
              data={packages}
              keyExtractor={(pkg) => pkg.id}
              emptyMessage="Belum ada paket umroh"
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
