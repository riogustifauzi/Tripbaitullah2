import { NextRequest, NextResponse } from 'next/server'
import { findById, update, deleteById } from '@/lib/utils/data-access'
import { blogSchema } from '@/lib/validations/blog.schema'
import { Blog } from '@/types/blog'

// GET /api/blogs/[id] - Get blog by ID (and increment views)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blog = await findById<Blog>('blogs.json', params.id)

    if (!blog) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Blog not found'
          }
        },
        { status: 404 }
      )
    }

    // Increment view count
    const updatedBlog = await update<Blog>('blogs.json', params.id, {
      views: blog.views + 1
    })

    return NextResponse.json(updatedBlog || blog)
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch blog'
        }
      },
      { status: 500 }
    )
  }
}

// PUT /api/blogs/[id] - Update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Update blog
    const updatedBlog = await update<Blog>('blogs.json', params.id, {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: typeof data.featuredImage === 'string' ? data.featuredImage : undefined,
      category: data.category,
      tags: data.tags,
      author: data.author,
      publishedAt: data.publishedAt.toISOString(),
      status: data.status,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      updatedAt: new Date().toISOString()
    })

    if (!updatedBlog) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Blog not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedBlog)
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update blog'
        }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/blogs/[id] - Delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteById('blogs.json', params.id)

    if (!deleted) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Blog not found'
          }
        },
        { status: 404 }
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete blog'
        }
      },
      { status: 500 }
    )
  }
}
