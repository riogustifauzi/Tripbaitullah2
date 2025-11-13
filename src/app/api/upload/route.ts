import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

// POST /api/upload - Upload file (image) to Vercel Blob Storage
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'No file provided'
          }
        },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid file type. Only JPG, PNG, WebP, and GIF are allowed.'
          }
        },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'File size exceeds 10MB limit'
          }
        },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 9)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomString}.${extension}`

    // Upload to Vercel Blob Storage
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    // Return file URL
    return NextResponse.json({
      url: blob.url,
      filename: filename,
      size: file.size,
      mimeType: file.type
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to upload file'
        }
      },
      { status: 500 }
    )
  }
}
