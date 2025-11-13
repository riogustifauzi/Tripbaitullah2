'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  LayoutDashboard, 
  Building, 
  Package, 
  FileText, 
  Image as ImageIcon,
  Settings,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface AdminSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const menuItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/paneladmin'
  },
  {
    label: 'Travel Umroh',
    icon: Building,
    href: '/paneladmin/travels'
  },
  {
    label: 'Paket Umroh',
    icon: Package,
    href: '/paneladmin/packages'
  },
  {
    label: 'Blog',
    icon: FileText,
    href: '/paneladmin/content'
  },
  {
    label: 'Hero Slides',
    icon: ImageIcon,
    href: '/paneladmin/hero-slides'
  },
  {
    label: 'Akun Pengguna',
    icon: Users,
    href: '/paneladmin/users'
  },
  {
    label: 'Pengaturan',
    icon: Settings,
    href: '/paneladmin/settings'
  }
]

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-20'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {isOpen && (
            <Link href="/paneladmin" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image 
                  src="/logo.svg" 
                  alt="Tripbaitullah" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Tripbaitullah
              </span>
            </Link>
          )}
          {!isOpen && (
            <div className="w-8 h-8 rounded-full overflow-hidden mx-auto">
              <Image 
                src="/logo.svg" 
                alt="Tripbaitullah" 
                width={32} 
                height={32}
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              // Special handling for Dashboard - only active on exact match
              const isActive = item.href === '/paneladmin' 
                ? pathname === '/paneladmin'
                : pathname === item.href || pathname.startsWith(item.href + '/')
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-3 py-2.5 rounded-lg
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    {isOpen && (
                      <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-200 p-2">
          <button
            onClick={() => {
              localStorage.removeItem('adminSession')
              window.location.href = '/paneladmin/login'
            }}
            className={`
              w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg
              text-red-600 hover:bg-red-50 transition-colors
            `}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="font-medium">Keluar</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <div className="hidden lg:block border-t border-gray-200 p-2">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
