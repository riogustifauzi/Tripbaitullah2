import { NextRequest, NextResponse } from 'next/server'
import { findById, update, deleteById, readData, writeData } from '@/lib/utils/data-access'
import { heroSlideSchema } from '@/lib/validations/hero-slide.schema'
import { HeroSlide } from '@/types/hero-slide'

// GET /api/hero-slides/[id] - Get slide by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slide = await findById<HeroSlide>('hero-slides.json', params.id)

    if (!slide) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Hero slide not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json(slide)
  } catch (error) {
    console.error('Error fetching hero slide:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch hero slide'
        }
      },
      { status: 500 }
    )
  }
}

// PUT /api/hero-slides/[id] - Update slide
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Validate request body
    const validationResult = heroSlideSchema.safeParse(body)
    
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

    // Update slide
    const updatedSlide = await update<HeroSlide>('hero-slides.json', params.id, {
      image: typeof data.image === 'string' ? data.image : undefined,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      ctaText: data.ctaText,
      ctaLink: data.ctaLink,
      isActive: data.isActive,
      updatedAt: new Date().toISOString()
    })

    if (!updatedSlide) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Hero slide not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedSlide)
  } catch (error) {
    console.error('Error updating hero slide:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update hero slide'
        }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/hero-slides/[id] - Delete slide
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if at least one slide will remain
    const slides = await readData<HeroSlide>('hero-slides.json')
    
    if (slides.length <= 1) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Cannot delete the last hero slide. At least one slide must exist.'
          }
        },
        { status: 400 }
      )
    }

    // Get the slide to be deleted
    const slideToDelete = await findById<HeroSlide>('hero-slides.json', params.id)
    
    if (!slideToDelete) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Hero slide not found'
          }
        },
        { status: 404 }
      )
    }

    // Delete slide
    const deleted = await deleteById('hero-slides.json', params.id)

    if (!deleted) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Hero slide not found'
          }
        },
        { status: 404 }
      )
    }

    // Reorder remaining slides
    const remainingSlides = await readData<HeroSlide>('hero-slides.json')
    const reorderedSlides = remainingSlides
      .sort((a, b) => a.order - b.order)
      .map((slide, index) => ({
        ...slide,
        order: index + 1
      }))
    
    await writeData('hero-slides.json', reorderedSlides)

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting hero slide:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete hero slide'
        }
      },
      { status: 500 }
    )
  }
}
