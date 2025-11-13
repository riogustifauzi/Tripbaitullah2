import { z } from 'zod'

// Custom validation for image - accepts both URL and local path
const imagePathSchema = z.string().refine(
  (val) => {
    if (!val || val === '') return false
    // Accept local paths starting with /
    if (val.startsWith('/')) return true
    // Accept full URLs
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  },
  { message: 'Image harus berupa URL yang valid atau path lokal (contoh: /image.jpg)' }
)

// Custom validation for CTA link - accepts both URL and local path
const linkPathSchema = z.string().refine(
  (val) => {
    if (!val || val === '') return true
    // Accept local paths starting with / or #
    if (val.startsWith('/') || val.startsWith('#')) return true
    // Accept full URLs
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  },
  { message: 'Link harus berupa URL yang valid atau path lokal (contoh: /paket)' }
)

export const heroSlideSchema = z.object({
  image: z.union([
    imagePathSchema,
    z.instanceof(File)
  ]),
  title: z.string()
    .min(5, 'Judul minimal 5 karakter')
    .max(100, 'Judul maksimal 100 karakter'),
  subtitle: z.string()
    .max(150, 'Subtitle maksimal 150 karakter')
    .optional()
    .or(z.literal('')),
  description: z.string()
    .max(300, 'Deskripsi maksimal 300 karakter')
    .optional()
    .or(z.literal('')),
  ctaText: z.string()
    .max(50, 'CTA text maksimal 50 karakter')
    .optional()
    .or(z.literal('')),
  ctaLink: linkPathSchema.optional().or(z.literal('')),
  isActive: z.boolean()
})

export type HeroSlideSchemaType = z.infer<typeof heroSlideSchema>
