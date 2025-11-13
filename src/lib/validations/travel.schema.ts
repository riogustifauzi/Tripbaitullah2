import { z } from 'zod'

const certificationSchema = z.object({
  name: z.string().min(1, 'Nama sertifikasi diperlukan'),
  number: z.string().min(1, 'Nomor sertifikasi diperlukan')
})

const achievementSchema = z.object({
  year: z.string().min(4, 'Tahun diperlukan'),
  title: z.string().min(1, 'Judul penghargaan diperlukan'),
  organization: z.string().min(1, 'Organisasi diperlukan')
})

const galleryImageSchema = z.object({
  id: z.string(),
  url: z.string().min(1, 'URL gambar diperlukan'),
  title: z.string().optional().default(''),
  description: z.string().optional().default('')
})

export const travelSchema = z.object({
  name: z.string()
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  logo: z.string()
    .min(1, 'Logo diperlukan'),
  city: z.string()
    .min(2, 'Kota minimal 2 karakter')
    .max(50, 'Kota maksimal 50 karakter'),
  address: z.string()
    .min(10, 'Alamat minimal 10 karakter')
    .max(200, 'Alamat maksimal 200 karakter'),
  phone: z.string()
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Format nomor telepon tidak valid'),
  email: z.string()
    .email('Format email tidak valid'),
  website: z.string()
    .url('Format website tidak valid')
    .optional()
    .or(z.literal('')),
  description: z.string()
    .min(20, 'Deskripsi minimal 20 karakter')
    .max(1000, 'Deskripsi maksimal 1000 karakter'),
  certifications: z.array(z.string()).optional().default([]),
  rating: z.number()
    .min(1, 'Rating minimal 1')
    .max(5, 'Rating maksimal 5')
    .optional()
    .default(5),
  status: z.enum(['active', 'inactive']),
  verified: z.boolean().optional().default(false),
  // Extended fields (optional)
  tagline: z.string().max(200, 'Tagline maksimal 200 karakter').optional(),
  experience: z.string().max(50, 'Pengalaman maksimal 50 karakter').optional(),
  facilities: z.array(z.string()).optional(),
  detailedCertifications: z.array(certificationSchema).optional(),
  achievements: z.array(achievementSchema).optional(),
  gallery: z.array(galleryImageSchema).optional()
})

export type TravelSchemaType = z.infer<typeof travelSchema>
