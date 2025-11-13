import { NextRequest, NextResponse } from 'next/server'
import { readData, update, deleteById } from '@/lib/utils/data-access'
import { User } from '@/types/user'

// GET /api/users/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const users = await readData<User>('users.json')
    const user = users.find(u => u.id === params.id)

    if (!user) {
      return NextResponse.json(
        { error: { message: 'User not found' } },
        { status: 404 }
      )
    }

    const { password, ...safeUser } = user
    return NextResponse.json(safeUser)
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Failed to fetch user' } },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const users = await readData<User>('users.json')
    const existingUser = users.find(u => u.id === params.id)

    if (!existingUser) {
      return NextResponse.json(
        { error: { message: 'User not found' } },
        { status: 404 }
      )
    }

    const updatedUser: User = {
      ...existingUser,
      username: body.username || existingUser.username,
      email: body.email || existingUser.email,
      ...(body.password && { password: body.password }), // Only update if provided
      role: body.role || existingUser.role,
      isActive: body.isActive !== undefined ? body.isActive : existingUser.isActive,
      updatedAt: new Date().toISOString()
    }

    await update('users.json', params.id, updatedUser)

    const { password, ...safeUser } = updatedUser
    return NextResponse.json(safeUser)
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Failed to update user' } },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteById('users.json', params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Failed to delete user' } },
      { status: 500 }
    )
  }
}
