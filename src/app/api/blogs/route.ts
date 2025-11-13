import { NextRequest, NextResponse } from 'next/server'
import { readData, create, generateId, generateSlug } from '@/lib/utils/data-access'
import { blogSchema } from '@/lib/validations/blog.schema'
import { Blog } from '@/types/blog'

// GET /api/blogs - List all blogs with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') as 'published' | 'draft' | null

    // Read all blogs
    let blogs = await readData<Blog>('blogs.json')

    // Apply filters
    if (search) {
      blogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category) {
      blogs = blogs.filter((blog) => blog.category === category)
    }

    if (status) {
      blogs = blogs.filter((blog) => blog.status === status)
    }

    // Sort by publishedAt descending
    blogs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    // Calculate pagination
    const total = blogs.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    // Get paginated data
    const paginatedBlogs = blogs.slice(startIndex, endIndex)

    return NextResponse.json({
      data: paginatedBlogs,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch blogs'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/blogs - Create new blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Convert date string to Date object for validation
    const dataToValidate = {
      ...body,
      publishedAt: new Date(body.publishedAt)
    }

    // Validate request body
    const validationResult = blogSchema.safeParse(dataToValidate)
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: validationResult.error.flatten().fieldErrors
          }
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Create new blog
    const newBlog: Blog = {
      id: generateId(),
      title: data.title,
      slug: data.slug || generateSlug(data.title),
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: typeof data.featuredImage === 'string' ? data.featuredImage : '',
      category: data.category,
      tags: data.tags,
      author: data.author,
      publishedAt: data.publishedAt.toISOString(),
      views: 0,
      status: data.status,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await create('blogs.json', newBlog)

    return NextResponse.json(newBlog, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create blog'
        }
      },
      { status: 500 }
    )
  }
}
