import { NextRequest, NextResponse } from 'next/server'
import { readData, create, generateId, writeData } from '@/lib/utils/data-access'
import { heroSlideSchema } from '@/lib/validations/hero-slide.schema'
import { HeroSlide } from '@/types/hero-slide'

// GET /api/hero-slides - List all slides ordered by order field
export async function GET(request: NextRequest) {
  try {
    // Read all slides
    let slides = await readData<HeroSlide>('hero-slides.json')

    // Sort by order ascending
    slides.sort((a, b) => a.order - b.order)

    return NextResponse.json({ data: slides })
  } catch (error) {
    console.error('Error fetching hero slides:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch hero slides'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/hero-slides - Create new slide
export async function POST(request: NextRequest) {
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

    // Get current slides to determine next order number
    const slides = await readData<HeroSlide>('hero-slides.json')
    const maxOrder = slides.length > 0 ? Math.max(...slides.map(s => s.order)) : 0

    // Create new slide
    const newSlide: HeroSlide = {
      id: generateId(),
      image: typeof data.image === 'string' ? data.image : '',
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      ctaText: data.ctaText,
      ctaLink: data.ctaLink,
      order: maxOrder + 1,
      isActive: data.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await create('hero-slides.json', newSlide)

    return NextResponse.json(newSlide, { status: 201 })
  } catch (error) {
    console.error('Error creating hero slide:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create hero slide'
        }
      },
      { status: 500 }
    )
  }
}
