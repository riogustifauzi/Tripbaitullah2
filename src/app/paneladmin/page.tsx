import AdminLayout from '@/components/admin/AdminLayout'
import StatsCard from '@/components/admin/StatsCard'
import { Building, Package, FileText, Users } from 'lucide-react'
import { readData } from '@/lib/utils/data-access'
import { Travel } from '@/types/travel'
import { Package as PackageType } from '@/types/package'
import { Blog } from '@/types/blog'

async function getDashboardStats() {
  const travels = await readData<Travel>('travels.json')
  const packages = await readData<PackageType>('packages.json')
  const blogs = await readData<Blog>('blogs.json')
  
  // Calculate total bookings (sum of bookedSeats from all packages)
  const totalBookings = packages.reduce((sum, pkg) => sum + pkg.bookedSeats, 0)
  
  return {
    totalTravels: travels.length,
    totalPackages: packages.length,
    totalBlogs: blogs.length,
    totalBookings
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang di Panel Admin Tripbaitullah</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Travel"
            value={stats.totalTravels}
            icon={Building}
            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatsCard
            title="Total Paket"
            value={stats.totalPackages}
            icon={Package}
            gradient="bg-gradient-to-r from-emerald-500 to-emerald-600"
          />
          <StatsCard
            title="Total Blog"
            value={stats.totalBlogs}
            icon={FileText}
            gradient="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatsCard
            title="Total Booking"
            value={stats.totalBookings}
            icon={Users}
            gradient="bg-gradient-to-r from-orange-500 to-orange-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/paneladmin/travels/new"
            className="p-6 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-center"
          >
            <Building className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="font-medium text-gray-900">Tambah Travel</p>
          </a>
          <a
            href="/paneladmin/packages/new"
            className="p-6 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-center"
          >
            <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="font-medium text-gray-900">Tambah Paket</p>
          </a>
          <a
            href="/paneladmin/content/new"
            className="p-6 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-center"
          >
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="font-medium text-gray-900">Tambah Artikel</p>
          </a>
          <a
            href="/paneladmin/hero-slides/new"
            className="p-6 bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-center"
          >
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="font-medium text-gray-900">Tambah Hero Slide</p>
          </a>
        </div>
      </div>
    </AdminLayout>
  )
}
