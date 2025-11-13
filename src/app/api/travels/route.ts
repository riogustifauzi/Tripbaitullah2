import { NextRequest, NextResponse } from 'next/server'
import { readData, create, generateId, generateSlug } from '@/lib/utils/data-access'
import { travelSchema } from '@/lib/validations/travel.schema'
import { Travel } from '@/types/travel'

// GET /api/travels - List all travels with pagination, search, and filter
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const city = searchParams.get('city') || ''
    const status = searchParams.get('status') as 'active' | 'inactive' | null

    // Read all travels
    let travels = await readData<Travel>('travels.json')

    // Apply filters
    if (search) {
      travels = travels.filter((travel) =>
        travel.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (city) {
      travels = travels.filter((travel) =>
        travel.city.toLowerCase() === city.toLowerCase()
      )
    }

    if (status) {
      travels = travels.filter((travel) => travel.status === status)
    }

    // Calculate pagination
    const total = travels.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    // Get paginated data
    const paginatedTravels = travels.slice(startIndex, endIndex)

    return NextResponse.json({
      data: paginatedTravels,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching travels:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch travels'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/travels - Create new travel provider
export async function POST(request: NextRequest) {
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

    // Create new travel
    const newTravel: Travel = {
      id: generateId(),
      name: data.name,
      slug: generateSlug(data.name),
      logo: typeof data.logo === 'string' ? data.logo : '',
      city: data.city,
      address: data.address,
      phone: data.phone,
      email: data.email,
      website: data.website || undefined,
      description: data.description,
      certifications: data.certifications,
      rating: data.rating,
      totalPackages: 0,
      status: data.status,
      verified: data.verified || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Extended fields
      tagline: data.tagline,
      experience: data.experience,
      facilities: data.facilities,
      detailedCertifications: data.detailedCertifications,
      achievements: data.achievements,
      gallery: data.gallery
    }

    await create('travels.json', newTravel)

    return NextResponse.json(newTravel, { status: 201 })
  } catch (error) {
    console.error('Error creating travel:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create travel'
        }
      },
      { status: 500 }
    )
  }
}
