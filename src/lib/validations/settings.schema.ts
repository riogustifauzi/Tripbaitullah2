import { z } from 'zod'

// Custom validation for logo/favicon - accepts both URL and local path
const imagePathSchema = z.string().refine(
  (val) => {
    if (!val || val === '') return true
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
  { message: 'Harus berupa URL yang valid atau path lokal (contoh: /logo.svg)' }
)

export const settingsSchema = z.object({
  siteName: z.string().min(1, 'Nama situs wajib diisi').max(100, 'Nama situs maksimal 100 karakter'),
  pageTitle: z.string().min(1, 'Judul halaman wajib diisi').max(100, 'Judul halaman maksimal 100 karakter'),
  logo: imagePathSchema,
  favicon: imagePathSchema,
  footerLogo: imagePathSchema,
  footerAbout: z.string().min(1, 'Deskripsi footer wajib diisi').max(500, 'Deskripsi footer maksimal 500 karakter'),
  footerPhone: z.string().min(1, 'Nomor telepon wajib diisi').max(20, 'Nomor telepon maksimal 20 karakter'),
  footerEmail: z.string().email('Email tidak valid').min(1, 'Email wajib diisi'),
  footerAddress: z.string().min(1, 'Alamat wajib diisi').max(200, 'Alamat maksimal 200 karakter'),
  footerCopyright: z.string().min(1, 'Copyright wajib diisi').max(200, 'Copyright maksimal 200 karakter'),
  packageDisplayOrder: z.enum(['newest', 'random'], {
    errorMap: () => ({ message: 'Pilih urutan tampilan yang valid' })
  }),
})

export type SettingsFormData = z.infer<typeof settingsSchema>
