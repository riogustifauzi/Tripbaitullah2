import { NextRequest, NextResponse } from 'next/server'
import { readData, create, generateId } from '@/lib/utils/data-access'
import { User } from '@/types/user'

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    const users = await readData<User>('users.json')
    
    // Remove passwords from response
    const safeUsers = users.map(({ password, ...user }) => user)
    
    return NextResponse.json({ data: safeUsers })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: { message: 'Failed to fetch users' } },
      { status: 500 }
    )
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newUser: User = {
      id: generateId(),
      username: body.username,
      email: body.email,
      password: body.password, // In production, hash this
      role: body.role || 'editor',
      isActive: body.isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await create('users.json', newUser)

    const { password, ...safeUser } = newUser
    return NextResponse.json(safeUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: { message: 'Failed to create user' } },
      { status: 500 }
    )
  }
}
