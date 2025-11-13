import { NextRequest, NextResponse } from 'next/server'
import { readData } from '@/lib/utils/data-access'
import { User } from '@/types/user'

// Disable caching for this route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log('Login attempt:', { username, password })

    // Read users from database
    const users = await readData<User>('users.json')
    console.log('Total users in database:', users.length)
    console.log('Available usernames:', users.map(u => u.username))

    // Find user
    const user = users.find(u => u.username === username)
    console.log('User found:', user ? 'Yes' : 'No')

    if (!user) {
      console.log('User not found')
      return NextResponse.json(
        { error: { message: 'Username tidak ditemukan' } },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('User is inactive')
      return NextResponse.json(
        { error: { message: 'Akun tidak aktif' } },
        { status: 401 }
      )
    }

    // Simple password check (in production, use bcrypt)
    console.log('Checking password:', { provided: password, stored: user.password })
    const isValidPassword = password === user.password

    if (!isValidPassword) {
      console.log('Password mismatch')
      return NextResponse.json(
        { error: { message: 'Password salah' } },
        { status: 401 }
      )
    }

    console.log('Login successful')

    // Create session
    const session = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: { message: 'Terjadi kesalahan saat login' } },
      { status: 500 }
    )
  }
}
