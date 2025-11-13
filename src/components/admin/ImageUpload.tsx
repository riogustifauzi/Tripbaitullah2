'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { validateImageFile, formatFileSize } from '@/lib/utils/image-utils'

interface ImageUploadProps {
  value?: string | string[]
  onChange: (value: string | string[]) => void
  multiple?: boolean
  maxFiles?: number
  label?: string
  helperText?: string
  error?: string
}

export default function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
  label,
  helperText = 'Max 10MB, format: JPG, PNG, WebP',
  error
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const images = Array.isArray(value) ? value : value ? [value] : []

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Check max files limit
    if (multiple && images.length + files.length > maxFiles) {
      setUploadError(`Maksimal ${maxFiles} gambar`)
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      const uploadedUrls: string[] = []

      for (const file of files) {
        // Validate file
        const validation = validateImageFile(file)
        if (!validation.valid) {
          setUploadError(validation.error || 'File tidak valid')
          continue
        }

        // Upload file
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const data = await response.json()
        uploadedUrls.push(data.url)
      }

      // Update value
      if (multiple) {
        onChange([...images, ...uploadedUrls])
      } else {
        onChange(uploadedUrls[0])
      }
    } catch (error) {
      setUploadError('Gagal upload gambar')
    } finally {
      setUploading(false)
      e.target.value = '' // Reset input
    }
  }

  const handleRemove = (index: number) => {
    if (multiple) {
      const newImages = images.filter((_, i) => i !== index)
      onChange(newImages)
    } else {
      onChange('')
    }
  }

  const canAddMore = multiple ? images.length < maxFiles : images.length === 0

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg border-2 border-gray-200 overflow-hidden group"
            >
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {canAddMore && (
        <div>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                <span className="text-sm text-gray-600 mt-2">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600 mt-2">
                  {multiple ? 'Upload Gambar' : 'Upload Gambar'}
                </span>
                {multiple && (
                  <span className="text-xs text-gray-500 mt-1">
                    {images.length} / {maxFiles} gambar
                  </span>
                )}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Helper Text */}
      {helperText && !error && !uploadError && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}

      {/* Error Messages */}
      {(error || uploadError) && (
        <p className="text-sm text-red-600">{error || uploadError}</p>
      )}
    </div>
  )
}
