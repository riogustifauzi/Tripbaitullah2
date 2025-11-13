'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, Heart, Menu, X, Phone, Mail, MapPin, Calendar, Clock, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Blog } from '@/types/blog'

export default function AllArticles() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [articles, setArticles] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs?status=published&limit=100')
        const data = await response.json()
        
        if (data.data) {
          setArticles(data.data)
          
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(data.data.map((blog: Blog) => blog.category)))
          setCategories(uniqueCategories as string[])
        }
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Calculate read time (rough estimate: 200 words per minute)
  const calculateReadTime = (content: string) => {
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} menit baca`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header Navigation */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/20 border-b border-white/20">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 flex items-center justify-center">
                <Image src="/uploads/1762771904921-h15y0ji.png" alt="Tripbaitullah Logo" width={40} height={40} className="object-contain" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Tripbaitullah
              </span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/#home" className="text-gray-700 hover:text-emerald-600 transition-colors">Beranda</a>
              <a href="/paket" className="text-gray-700 hover:text-emerald-600 transition-colors">Paket Umroh</a>
              <a href="/travel" className="text-gray-700 hover:text-emerald-600 transition-colors">Travel Umroh</a>
              <a href="/blog" className="text-emerald-600 font-semibold">Blog</a>
              <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                Hubungi Kami
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 p-4 bg-white/80 backdrop-blur-md rounded-lg border border-white/20">
              <div className="flex flex-col space-y-4">
                <a href="/#home" className="text-gray-700 hover:text-emerald-600 transition-colors">Beranda</a>
                <a href="/paket" className="text-gray-700 hover:text-emerald-600 transition-colors">Paket Umroh</a>
                <a href="/travel" className="text-gray-700 hover:text-emerald-600 transition-colors">Travel Umroh</a>
                <a href="/blog" className="text-emerald-600 font-semibold">Blog</a>
                <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700">
                  Hubungi Kami
                </Button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Blog & Artikel
            </h1>
            <p className="text-gray-600 text-lg">
              Wawasan dan tips bermanfaat untuk persiapan ibadah umroh Anda
            </p>
          </div>

          {/* Search and Filter Bar */}
          <Card className="bg-white/90 backdrop-blur-sm border-white/20 mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Cari artikel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {categories.filter(c => c !== 'all').map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-gray-600">
              Menampilkan <span className="font-semibold text-emerald-600">{filteredArticles.length}</span> artikel
            </p>
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredArticles.map((article) => (
                <Card 
                  key={article.id} 
                  className="bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/blog/${article.id}`)}
                >
                  <CardHeader className="p-0">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-emerald-600 text-white text-xs">
                        {article.category}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{calculateReadTime(article.content)}</span>
                      </div>
                    </div>
                    <CardTitle className="text-base mb-2 line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {article.excerpt}
                    </CardDescription>
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm border-white/20">
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Tidak ada artikel ditemukan
                </h3>
                <p className="text-gray-500 mb-4">
                  Coba ubah kata kunci pencarian Anda
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  Reset Pencarian
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <a href="/" className="flex items-center space-x-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Image 
                    src="/uploads/1762771919359-zayvu3d.png" 
                    alt="Tripbaitullah Logo" 
                    width={40} 
                    height={40} 
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold">Tripbaitullah</span>
              </a>
              <p className="text-gray-400">
                Platform terpercaya untuk menemukan paket umroh terbaik dari travel umroh berpengalaman.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/paket" className="hover:text-white transition-colors">Paket Umroh</a></li>
                <li><a href="/travel" className="hover:text-white transition-colors">Travel Umroh</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Visa & Dokumen</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Asuransi</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Informasi</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>info@tripbaitullah.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Jakarta, Indonesia</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800" />

          <div className="text-center text-gray-400">
            <p>© 2024 Tripbaitullah. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
