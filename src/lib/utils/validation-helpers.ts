/**
 * Validation helper functions for common form validations
 */

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Indonesian phone number validation
export function isValidIndonesianPhone(phone: string): boolean {
  // Accepts formats: 08xx, +628xx, 628xx
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/
  return phoneRegex.test(phone.replace(/[\s-]/g, ''))
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Slug validation (URL-safe string)
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug)
}

// File size validation (in bytes)
export function isValidFileSize(size: number, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return size <= maxSizeBytes
}

// Image file type validation
export function isValidImageType(type: string): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  return validTypes.includes(type)
}

// Date range validation
export function isValidDateRange(startDate: Date, endDate: Date): boolean {
  return endDate > startDate
}

// Rating validation (1-5)
export function isValidRating(rating: number): boolean {
  return rating >= 1 && rating <= 5
}

// Format validation error messages
export function formatValidationError(field: string, error: string): string {
  const errorMessages: Record<string, string> = {
    required: `${field} wajib diisi`,
    email: `${field} harus berupa email yang valid`,
    phone: `${field} harus berupa nomor telepon Indonesia yang valid`,
    url: `${field} harus berupa URL yang valid`,
    slug: `${field} harus berupa slug yang valid (huruf kecil, angka, dan tanda hubung)`,
    min: `${field} terlalu pendek`,
    max: `${field} terlalu panjang`,
    minLength: `${field} minimal harus memiliki karakter yang ditentukan`,
    maxLength: `${field} melebihi batas karakter maksimal`,
    fileSize: `Ukuran file ${field} terlalu besar`,
    fileType: `Tipe file ${field} tidak didukung`,
    dateRange: `Tanggal akhir harus setelah tanggal mulai`,
    rating: `Rating harus antara 1-5`
  }

  return errorMessages[error] || `${field} tidak valid`
}

// Format Zod errors for display
export function formatZodErrors(errors: any): Record<string, string> {
  const formatted: Record<string, string> = {}
  
  if (errors.fieldErrors) {
    Object.keys(errors.fieldErrors).forEach((field) => {
      const fieldErrors = errors.fieldErrors[field]
      if (fieldErrors && fieldErrors.length > 0) {
        formatted[field] = fieldErrors[0]
      }
    })
  }
  
  return formatted
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Validate and format Indonesian Rupiah
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

// Parse Rupiah string to number
export function parseRupiah(rupiah: string): number {
  return parseInt(rupiah.replace(/[^0-9]/g, '')) || 0
}

// Validate quota (must be positive integer)
export function isValidQuota(quota: number): boolean {
  return Number.isInteger(quota) && quota > 0
}

// Validate duration (must be positive integer)
export function isValidDuration(duration: number): boolean {
  return Number.isInteger(duration) && duration > 0
}
