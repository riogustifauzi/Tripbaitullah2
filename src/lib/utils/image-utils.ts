/**
 * Image utility functions for optimization and processing
 */

/**
 * Get optimized image URL for Next.js Image component
 */
export function getOptimizedImageUrl(url: string, width?: number, quality?: number): string {
  if (!url) return ''
  
  // If it's already an external URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // For local images, Next.js Image component will handle optimization
  return url
}

/**
 * Generate thumbnail URL (for list views)
 */
export function getThumbnailUrl(url: string): string {
  return getOptimizedImageUrl(url, 200, 75)
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Format file tidak valid. Hanya JPG, PNG, dan WebP yang diperbolehkan.'
    }
  }
  
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: 'Ukuran file melebihi batas 10MB'
    }
  }
  
  return { valid: true }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get image dimensions from file
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.width,
        height: img.height
      })
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    
    img.src = url
  })
}

/**
 * Check if image meets recommended dimensions
 */
export function checkImageDimensions(
  width: number,
  height: number,
  recommended: { width: number; height: number }
): { valid: boolean; message?: string } {
  const aspectRatio = width / height
  const recommendedRatio = recommended.width / recommended.height
  const ratioDiff = Math.abs(aspectRatio - recommendedRatio)
  
  // Allow 10% difference in aspect ratio
  if (ratioDiff > 0.1) {
    return {
      valid: false,
      message: `Rasio aspek gambar tidak sesuai. Disarankan ${recommended.width}x${recommended.height}`
    }
  }
  
  return { valid: true }
}

/**
 * Create image preview URL from File
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * Revoke image preview URL
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url)
}
