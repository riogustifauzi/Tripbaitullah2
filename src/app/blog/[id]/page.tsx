'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Heart, Menu, X, Phone, Mail, MapPin, 
  ChevronLeft, Calendar, Clock, User, Share2, Tag, Check, Copy, MessageCircle, Send, ChevronUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState, useEffect } from 'react'

export default function BlogDetail() {
  const params = useParams()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Comments state
  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'Ahmad Fauzi',
      email: 'ahmad@example.com',
      comment: 'Artikel yang sangat bermanfaat! Terima kasih atas tips persiapannya.',
      date: '14 November 2024',
      time: '10:30'
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      email: 'siti@example.com',
      comment: 'Alhamdulillah, saya jadi lebih siap untuk berangkat umroh bulan depan. Jazakallah khair.',
      date: '14 November 2024',
      time: '15:45'
    }
  ])
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    comment: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Get current URL for sharing
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  
  const handleShare = (platform: string) => {
    const text = `${article.title} - Tripbaitullah`
    const url = shareUrl

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
    }
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.name || !newComment.email || !newComment.comment) {
      alert('Mohon lengkapi semua field')
      return
    }

    setSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      const now = new Date()
      const comment = {
        id: comments.length + 1,
        name: newComment.name,
        email: newComment.email,
        comment: newComment.comment,
        date: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
      
      setComments([comment, ...comments])
      setNewComment({ name: '', email: '', comment: '' })
      setSubmitting(false)
      alert('Komentar berhasil ditambahkan!')
    }, 1000)
  }

  // Fetch article from API
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/blogs/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setArticle(data)
        } else {
          console.error('Article not found')
          router.push('/blog')
        }
      } catch (error) {
        console.error('Error fetching article:', error)
        router.push('/blog')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchArticle()
    }
  }, [params.id, router])

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Calculate read time
  const calculateReadTime = (content: string) => {
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} menit baca`
  }

  // Show loading state
  if (loading || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat artikel...</p>
        </div>
      </div>
    )
  }

  // Mock related articles - in real app, fetch from API
  const relatedArticles = [
    {
      id: 2,
      title: 'Panduan Lengkap Ibadah Umroh untuk Pemula',
      category: 'Panduan',
      image: '/masjid-nabawi.jpg',
      readTime: '8 menit baca'
    },
    {
      id: 3,
      title: 'Doa-Doa Mustajab di Tanah Suci',
      category: 'Doa',
      image: '/arafat.jpg',
      readTime: '6 menit baca'
    },
    {
      id: 4,
      title: 'Tips Hemat Selama di Tanah Suci',
      category: 'Tips',
      image: '/luxury-hotel.jpg',
      readTime: '4 menit baca'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header Navigation */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/20 border-b border-white/20">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Image src="/uploads/1762771904921-h15y0ji.png" alt="Tripbaitullah Logo" width={40} height={40} className="object-contain" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Tripbaitullah
                </span>
              </div>
            </div>

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
        <div className="container mx-auto max-w-4xl">
          {/* Article Header */}
          <Card className="bg-white/90 backdrop-blur-sm border-white/20 mb-8">
            <CardContent className="p-0">
              {/* Featured Image */}
              <div className="relative">
                <img
                  src={article?.featuredImage}
                  alt={article?.title}
                  className="w-full h-96 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="secondary" className="bg-white/80 backdrop-blur-sm hover:bg-white">
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="cursor-pointer">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('facebook')} className="cursor-pointer">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('twitter')} className="cursor-pointer">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('telegram')} className="cursor-pointer">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                        Telegram
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('copy')} className="cursor-pointer">
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2 text-green-600" />
                            <span className="text-green-600">Link Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Salin Link
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Article Meta */}
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Badge className="bg-emerald-600 text-white">
                    <Tag className="w-3 h-3 mr-1" />
                    {article?.category}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{article?.content ? calculateReadTime(article.content) : '5 menit baca'}</span>
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {article?.title}
                </h1>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{article?.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{article?.publishedAt ? formatDate(article.publishedAt) : ''}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article Content */}
          <Card className="bg-white/90 backdrop-blur-sm border-white/20 mb-8">
            <CardContent className="p-8">
              <div 
                className="prose prose-lg max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
                  prose-h1:text-4xl prose-h1:mt-10 prose-h1:mb-6 prose-h1:leading-tight
                  prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:leading-snug prose-h2:border-l-4 prose-h2:border-emerald-600 prose-h2:pl-4
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-emerald-700
                  prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
                  prose-p:text-gray-700 prose-p:leading-loose prose-p:mb-6 prose-p:text-lg
                  prose-p:first-of-type:text-xl prose-p:first-of-type:leading-relaxed prose-p:first-of-type:text-gray-800
                  prose-a:text-emerald-600 prose-a:no-underline prose-a:font-medium hover:prose-a:text-emerald-700 hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-bold
                  prose-em:text-gray-800 prose-em:italic
                  prose-ul:my-6 prose-ul:space-y-2
                  prose-ol:my-6 prose-ol:space-y-2
                  prose-li:text-gray-700 prose-li:leading-relaxed prose-li:text-lg
                  prose-li:marker:text-emerald-600 prose-li:marker:font-bold
                  prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-6
                  prose-blockquote:bg-emerald-50 prose-blockquote:italic prose-blockquote:text-gray-700
                  prose-code:text-emerald-700 prose-code:bg-emerald-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                  prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-lg prose-pre:my-6 prose-pre:overflow-x-auto
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                  prose-hr:border-gray-300 prose-hr:my-10
                  prose-table:my-6 prose-table:border-collapse
                  prose-th:bg-emerald-50 prose-th:text-gray-900 prose-th:font-bold prose-th:p-3 prose-th:border prose-th:border-gray-300
                  prose-td:p-3 prose-td:border prose-td:border-gray-300 prose-td:text-gray-700
                  first-letter:text-5xl first-letter:font-bold first-letter:text-emerald-600 first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1"
                dangerouslySetInnerHTML={{ __html: article?.content || '' }}
              />
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="bg-white/90 backdrop-blur-sm border-white/20 mb-8">
            <CardContent className="p-8">
              <div className="flex items-center space-x-2 mb-6">
                <MessageCircle className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Komentar ({comments.length})
                </h2>
              </div>

              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="mb-8 p-6 bg-emerald-50 rounded-lg border border-emerald-200">
                <h3 className="font-semibold text-gray-900 mb-4">Tinggalkan Komentar</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Nama Anda *"
                        value={newComment.name}
                        onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email Anda *"
                        value={newComment.email}
                        onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Textarea
                    placeholder="Tulis komentar Anda... *"
                    value={newComment.comment}
                    onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                    rows={4}
                    required
                  />
                  <Button 
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? 'Mengirim...' : 'Kirim Komentar'}
                  </Button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Belum ada komentar. Jadilah yang pertama berkomentar!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                            {comment.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{comment.name}</h4>
                            <span className="text-sm text-gray-500">
                              {comment.date} • {comment.time}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Artikel Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Card 
                  key={related.id}
                  className="bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/blog/${related.id}`)}
                >
                  <CardContent className="p-0">
                    <img
                      src={related.image}
                      alt={related.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-emerald-600 text-white text-xs">
                          {related.category}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{related.readTime}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {related.title}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Back to Blog Button */}
          <div className="text-center">
            <Button 
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              onClick={() => router.push('/blog')}
            >
              Kembali ke Blog
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Kembali ke atas"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Tripbaitullah</span>
              </div>
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
