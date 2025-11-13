import { NextRequest, NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/utils/data-access'
import { HeroSlide } from '@/types/hero-slide'

// POST /api/hero-slides/reorder - Reorder slides
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slides } = body as { slides: Array<{ id: string; order: number }> }

    if (!slides || !Array.isArray(slides)) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body. Expected array of slides with id and order.'
          }
        },
        { status: 400 }
      )
    }

    // Read current slides
    const currentSlides = await readData<HeroSlide>('hero-slides.json')

    // Update order for each slide
    const updatedSlides = currentSlides.map((slide) => {
      const newOrder = slides.find((s) => s.id === slide.id)
      if (newOrder) {
        return {
          ...slide,
          order: newOrder.order,
          updatedAt: new Date().toISOString()
        }
      }
      return slide
    })

    // Sort by new order
    updatedSlides.sort((a, b) => a.order - b.order)

    // Save updated slides
    await writeData('hero-slides.json', updatedSlides)

    return NextResponse.json({ data: updatedSlides })
  } catch (error) {
    console.error('Error reordering hero slides:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to reorder hero slides'
        }
      },
      { status: 500 }
    )
  }
}
