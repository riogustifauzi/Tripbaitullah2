import { NextRequest, NextResponse } from 'next/server'
import { findById, update, deleteById } from '@/lib/utils/data-access'
import { travelSchema } from '@/lib/validations/travel.schema'
import { Travel } from '@/types/travel'

// GET /api/travels/[id] - Get travel by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const travel = await findById<Travel>('travels.json', params.id)

    if (!travel) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Travel provider not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json(travel)
  } catch (error) {
    console.error('Error fetching travel:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch travel'
        }
      },
      { status: 500 }
    )
  }
}

// PUT /api/travels/[id] - Update travel
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Validate request body
    const validationResult = travelSchema.safeParse(body)
    
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

    // Update travel
    const updatedTravel = await update<Travel>('travels.json', params.id, {
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      logo: typeof data.logo === 'string' ? data.logo : undefined,
      city: data.city,
      address: data.address,
      phone: data.phone,
      email: data.email,
      website: data.website || undefined,
      description: data.description,
      certifications: data.certifications,
      rating: data.rating,
      status: data.status,
      verified: data.verified || false,
      updatedAt: new Date().toISOString(),
      // Extended fields
      tagline: data.tagline,
      experience: data.experience,
      facilities: data.facilities,
      detailedCertifications: data.detailedCertifications,
      achievements: data.achievements,
      gallery: data.gallery
    })

    if (!updatedTravel) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Travel provider not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedTravel)
  } catch (error) {
    console.error('Error updating travel:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update travel'
        }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/travels/[id] - Delete travel
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if travel has associated packages
    const { readData } = await import('@/lib/utils/data-access')
    const packages = await readData('packages.json')
    const hasPackages = packages.some((pkg: any) => pkg.travelId === params.id)

    if (hasPackages) {
      return NextResponse.json(
        {
          error: {
            code: 'CONFLICT',
            message: 'Cannot delete travel provider with existing packages'
          }
        },
        { status: 409 }
      )
    }

    const deleted = await deleteById('travels.json', params.id)

    if (!deleted) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Travel provider not found'
          }
        },
        { status: 404 }
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting travel:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete travel'
        }
      },
      { status: 500 }
    )
  }
}
