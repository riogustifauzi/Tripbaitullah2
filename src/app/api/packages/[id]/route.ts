import { NextRequest, NextResponse } from 'next/server'
import { findById, update, deleteById, readData } from '@/lib/utils/data-access'
import { packageSchema } from '@/lib/validations/package.schema'
import { Package } from '@/types/package'
import { Travel } from '@/types/travel'

// GET /api/packages/[id] - Get package by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pkg = await findById<Package>('packages.json', params.id)

    if (!pkg) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Package not found'
          }
        },
        { status: 404 }
      )
    }

    // Populate travel data
    const travel = await findById<Travel>('travels.json', pkg.travelId)
    const packageWithTravel = {
      ...pkg,
      travel
    }

    return NextResponse.json(packageWithTravel)
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch package'
        }
      },
      { status: 500 }
    )
  }
}

// PUT /api/packages/[id] - Update package
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

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

    // Validate request body
    const validationResult = packageSchema.safeParse(dataToValidate)
    
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

    // Update package
    const updatedPackage = await update<Package>('packages.json', params.id, {
      title: data.title,
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      travelId: data.travelId,
      description: data.description,
      duration: data.duration,
      departureDate: data.departureDate.toISOString(),
      returnDate: data.returnDate.toISOString(),
      departureCity: data.departureCity,
      quota: data.quota || 100,
      airline: data.airline,
      flightType: data.flightType,
      pricingTiers: data.pricingTiers,
      facilities: data.facilities,
      excludedFacilities: data.excludedFacilities,
      itinerary: data.itinerary,
      images: data.images.filter((img): img is string => typeof img === 'string'),
      status: data.status,
      updatedAt: new Date().toISOString()
    })

    if (!updatedPackage) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Package not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedPackage)
  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update package'
        }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/packages/[id] - Delete package
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get package to find its travelId
    const pkg = await findById<Package>('packages.json', params.id)
    
    if (!pkg) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Package not found'
          }
        },
        { status: 404 }
      )
    }

    // Delete package
    const deleted = await deleteById('packages.json', params.id)

    if (!deleted) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Package not found'
          }
        },
        { status: 404 }
      )
    }

    // Update travel's totalPackages count
    const travel = await findById<Travel>('travels.json', pkg.travelId)
    if (travel && travel.totalPackages > 0) {
      await update<Travel>('travels.json', pkg.travelId, {
        totalPackages: travel.totalPackages - 1
      })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete package'
        }
      },
      { status: 500 }
    )
  }
}
