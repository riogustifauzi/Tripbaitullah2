import { z } from 'zod'

export const blogSchema = z.object({
  title: z.string()
    .min(10, 'Judul minimal 10 karakter')
    .max(200, 'Judul maksimal 200 karakter'),
  slug: z.string()
    .min(1, 'Slug diperlukan')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug harus URL-safe'),
  excerpt: z.string()
    .min(50, 'Excerpt minimal 50 karakter')
    .max(300, 'Excerpt maksimal 300 karakter'),
  content: z.string()
    .min(100, 'Konten minimal 100 karakter'),
  featuredImage: z.string()
    .min(1, 'Featured image diperlukan')
    .refine((val) => {
      // Allow relative paths (uploaded files) or full URLs
      return val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://')
    }, 'Featured image harus berupa URL valid atau path file'),
  category: z.string().min(1, 'Kategori diperlukan'),
  tags: z.array(z.string()).default([]),
  author: z.string().min(1, 'Penulis diperlukan'),
  publishedAt: z.date(),
  status: z.enum(['published', 'draft']),
  metaTitle: z.string().max(60, 'Meta title maksimal 60 karakter').transform(val => val || undefined).optional(),
  metaDescription: z.string().max(160, 'Meta description maksimal 160 karakter').transform(val => val || undefined).optional()
})

export type BlogSchemaType = z.infer<typeof blogSchema>
