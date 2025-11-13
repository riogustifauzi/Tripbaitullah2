'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/admin/ImageUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { useToast } from '@/components/admin/ToastContainer'
import { Loader2, X } from 'lucide-react'
import { Blog, BlogFormData } from '@/types/blog'

interface BlogFormProps {
  initialData?: Blog
  mode: 'create' | 'edit'
}

const CATEGORIES = ['Tips', 'Panduan', 'Berita', 'Inspirasi', 'Lainnya']

export default function BlogForm({ initialData, mode }: BlogFormProps) {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tagInput, setTagInput] = useState('')

  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    featuredImage: initialData?.featuredImage || '',
    category: initialData?.category || 'Tips',
    tags: initialData?.tags || [],
    author: initialData?.author || 'Admin',
    publishedAt: initialData?.publishedAt ? new Date(initialData.publishedAt) : new Date(),
    status: initialData?.status || 'draft',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || ''
  })

  const handleInputChange = (field: keyof BlogFormData, value: any) => {
    setFormData({ ...formData, [field]: value })
    
    // Auto-generate slug from title
    if (field === 'title' && mode === 'create') {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      setFormData(prev => ({ ...prev, slug }))
    }
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange('tags', [...formData.tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    handleInputChange('tags', formData.tags.filter(t => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Client-side validation
    const newErrors: Record<string, string> = {}
    
    if (!formData.title || formData.title.trim().length < 10) {
      newErrors.title = 'Judul minimal 10 karakter'
    }
    
    if (!formData.slug || formData.slug.trim() === '') {
      newErrors.slug = 'Slug diperlukan'
    }
    
    if (!formData.excerpt || formData.excerpt.trim().length < 50) {
      newErrors.excerpt = 'Excerpt minimal 50 karakter'
    }
    
    if (!formData.content || formData.content.trim().length < 100) {
      newErrors.content = 'Konten minimal 100 karakter'
    }
    
    if (!formData.featuredImage || formData.featuredImage.trim() === '') {
      newErrors.featuredImage = 'Featured image diperlukan. Silakan upload gambar terlebih dahulu.'
    }
    
    if (!formData.author || formData.author.trim() === '') {
      newErrors.author = 'Penulis diperlukan'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      toast.error('Mohon lengkapi semua field yang diperlukan')
      // Scroll to first error
      setTimeout(() => {
        const firstErrorElement = document.querySelector('[class*="text-red"]')
        firstErrorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
      return
    }

    try {
      const url = mode === 'create' 
        ? '/api/blogs'
        : `/api/blogs/${initialData?.id}`

      const payload = {
        ...formData,
        publishedAt: formData.publishedAt.toISOString()
      }
      
      console.log('Submitting blog data:', payload)

      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('API Error:', data)
        
        if (data.error?.details) {
          setErrors(data.error.details)
          console.error('Validation errors:', data.error.details)
          
          // Get first error message to show in toast
          const firstError = Object.entries(data.error.details)[0]
          if (firstError) {
            const [field, errors] = firstError
            const errorMsg = Array.isArray(errors) ? errors[0] : errors
            toast.error(`${field}: ${errorMsg}`)
          } else {
            toast.error('Validasi gagal. Periksa kembali form Anda.')
          }
          
          // Scroll to first error
          setTimeout(() => {
            const firstErrorElement = document.querySelector('[class*="text-red"]')
            firstErrorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }, 100)
        } else {
          toast.error(data.error?.message || 'Terjadi kesalahan')
        }
        return
      }

      // Show success message
      toast.success(
        mode === 'create' 
          ? 'Artikel berhasil dipublikasikan!' 
          : 'Artikel berhasil diperbarui!'
      )

      // Redirect after short delay to show toast
      setTimeout(() => {
        router.push('/paneladmin/content')
        router.refresh()
      }, 1500)
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Informasi Dasar</h2>

        <div>
          <Label htmlFor="title">Judul Artikel *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Contoh: Tips Persiapan Umroh untuk Pemula"
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
        </div>

        <div>
          <Label htmlFor="slug">Slug (URL) *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="tips-persiapan-umroh-untuk-pemula"
          />
          {errors.slug && <p className="text-sm text-red-600 mt-1">{errors.slug}</p>}
          <p className="text-xs text-gray-500 mt-1">URL-friendly format</p>
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt (Ringkasan) *</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => handleInputChange('excerpt', e.target.value)}
            placeholder="Ringkasan singkat artikel (50-300 karakter)"
            rows={3}
          />
          {errors.excerpt && <p className="text-sm text-red-600 mt-1">{errors.excerpt}</p>}
          <p className="text-xs text-gray-500 mt-1">
            {formData.excerpt.length}/300 karakter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Kategori *</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="author">Penulis *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="publishedAt">Tanggal Publish *</Label>
          <Input
            id="publishedAt"
            type="date"
            value={formData.publishedAt.toISOString().split('T')[0]}
            onChange={(e) => handleInputChange('publishedAt', new Date(e.target.value))}
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Konten Artikel</h2>
        
        <RichTextEditor
          label="Konten *"
          value={formData.content}
          onChange={(value) => handleInputChange('content', value)}
          error={errors.content}
        />
      </div>

      {/* Featured Image */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Featured Image</h2>
        
        <ImageUpload
          value={formData.featuredImage}
          onChange={(value) => {
            const imageUrl = Array.isArray(value) ? value[0] : value
            handleInputChange('featuredImage', typeof imageUrl === 'string' ? imageUrl : '')
          }}
          label="Gambar Utama *"
          helperText="Rekomendasi: 1200x630px, max 5MB"
          error={errors.featuredImage}
        />
      </div>

      {/* Tags */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
        
        <div className="flex items-center space-x-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="Tambah tag..."
          />
          <Button type="button" onClick={handleAddTag} variant="outline">
            Tambah
          </Button>
        </div>

        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-emerald-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* SEO */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">SEO (Optional)</h2>

        <div>
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            value={formData.metaTitle}
            onChange={(e) => handleInputChange('metaTitle', e.target.value)}
            placeholder="Judul untuk SEO (max 60 karakter)"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.metaTitle?.length || 0}/60 karakter
          </p>
        </div>

        <div>
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            value={formData.metaDescription}
            onChange={(e) => handleInputChange('metaDescription', e.target.value)}
            placeholder="Deskripsi untuk SEO (max 160 karakter)"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.metaDescription?.length || 0}/160 karakter
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Status Publikasi</h2>
        
        <select
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value as 'published' | 'draft')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-emerald-600 to-green-600"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {loading 
            ? (mode === 'create' ? 'Mempublikasikan...' : 'Menyimpan...')
            : (mode === 'create' ? 'Publish Artikel' : 'Simpan Perubahan')
          }
        </Button>
      </div>
    </form>
  )
}
