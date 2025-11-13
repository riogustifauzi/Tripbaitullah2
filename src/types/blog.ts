export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  tags: string[]
  author: string
  publishedAt: string
  views: number
  status: 'published' | 'draft'
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
}

export interface BlogFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  tags: string[]
  author: string
  publishedAt: Date
  status: 'published' | 'draft'
  metaTitle?: string
  metaDescription?: string
}
