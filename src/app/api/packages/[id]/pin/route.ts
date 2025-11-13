import { NextRequest, NextResponse } from 'next/server'
import { findById, update } from '@/lib/utils/data-access'
import { Package } from '@/types/package'

// POST /api/packages/[id]/pin - Toggle pin status
export async function POST(
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

    // Toggle pin status
    const newPinStatus = !pkg.isPinned
    const updatedPackage = await update<Package>('packages.json', params.id, {
      isPinned: newPinStatus,
      pinnedAt: newPinStatus ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json(updatedPackage)
  } catch (error) {
    console.error('Error toggling pin status:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to toggle pin status'
        }
      },
      { status: 500 }
    )
  }
}
