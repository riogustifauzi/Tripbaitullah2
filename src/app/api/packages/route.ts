import { NextRequest, NextResponse } from 'next/server'
import { readData, create, generateId, generateSlug, findById } from '@/lib/utils/data-access'
import { packageSchema } from '@/lib/validations/package.schema'
import { Package } from '@/types/package'
import { Travel } from '@/types/travel'

// GET /api/packages - List all packages with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const travelId = searchParams.get('travelId') || ''
    const status = searchParams.get('status') as 'active' | 'draft' | null
    const dateFrom = searchParams.get('dateFrom') || ''
    const dateTo = searchParams.get('dateTo') || ''

    // Read all packages
    let packages = await readData<Package>('packages.json')

    // Populate travel data
    const travels = await readData<Travel>('travels.json')
    packages = packages.map((pkg) => ({
      ...pkg,
      travel: travels.find((t) => t.id === pkg.travelId)
    }))

    // Apply filters
    if (search) {
      packages = packages.filter((pkg) =>
        pkg.title.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (travelId) {
      packages = packages.filter((pkg) => pkg.travelId === travelId)
    }

    if (status) {
      packages = packages.filter((pkg) => pkg.status === status)
    }

    if (dateFrom) {
      packages = packages.filter(
        (pkg) => new Date(pkg.departureDate) >= new Date(dateFrom)
      )
    }

    if (dateTo) {
      packages = packages.filter(
        (pkg) => new Date(pkg.departureDate) <= new Date(dateTo)
      )
    }

    // Calculate pagination
    const total = packages.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    // Get paginated data
    const paginatedPackages = packages.slice(startIndex, endIndex)

    return NextResponse.json({
      data: paginatedPackages,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch packages'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/packages - Create new package
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received body:', body)

    // Clean up excludedFacilities - remove empty strings
    // Clean up itinerary activities - remove empty strings
    const cleanedBody = {
      ...body,
      excludedFacilities: (body.excludedFacilities || []).filter((f: string) => f && f.trim() !== ''),
      itinerary: (body.itinerary || []).map((day: any) => ({
        ...day,
        activities: (day.activities || []).filter((a: string) => a && a.trim() !== '')
      }))
    }

    // Convert date strings to Date objects for validation
    const dataToValidate = {
      ...cleanedBody,
      departureDate: new Date(cleanedBody.departureDate),
      returnDate: new Date(cleanedBody.returnDate)
    }

    console.log('Data to validate:', dataToValidate)

    // Validate request body
    const validationResult = packageSchema.safeParse(dataToValidate)
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error)
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

    // Verify travel exists
    const travel = await findById<Travel>('travels.json', data.travelId)
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

    // Create new package
    const newPackage: Package = {
      id: generateId(),
      title: data.title,
      slug: generateSlug(data.title),
      travelId: data.travelId,
      description: data.description,
      duration: data.duration,
      departureDate: data.departureDate.toISOString(),
      returnDate: data.returnDate.toISOString(),
      departureCity: data.departureCity || undefined,
      quota: data.quota || 100,
      bookedSeats: 0,
      airline: data.airline || undefined,
      flightType: data.flightType || undefined,
      pricingTiers: data.pricingTiers,
      facilities: data.facilities,
      excludedFacilities: data.excludedFacilities || undefined,
      itinerary: data.itinerary,
      images: data.images.filter((img): img is string => typeof img === 'string'),
      status: data.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('Creating package:', newPackage)
    await create('packages.json', newPackage)
    console.log('Package created in database')

    // Update travel's totalPackages count
    const { update } = await import('@/lib/utils/data-access')
    await update<Travel>('travels.json', data.travelId, {
      totalPackages: travel.totalPackages + 1
    })

    console.log('Package created successfully:', newPackage)
    return NextResponse.json(newPackage, { status: 201 })
  } catch (error) {
    console.error('Error creating package:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create package',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}
