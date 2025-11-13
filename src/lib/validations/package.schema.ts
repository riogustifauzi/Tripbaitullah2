import { z } from 'zod'

const pricingTierSchema = z.object({
  name: z.string().min(1, 'Nama tier diperlukan'),
  price: z.number().min(0, 'Harga harus positif'),
  originalPrice: z.number().min(0, 'Harga coret harus positif').optional(),
  cashback: z.number().min(0, 'Cashback harus positif').optional(),
  hotelMakkah: z.string().min(1, 'Hotel Makkah diperlukan'),
  hotelMadinah: z.string().min(1, 'Hotel Madinah diperlukan'),
  roomType: z.string().min(1, 'Tipe kamar diperlukan'),
  additionalFacilities: z.array(z.string()).default([]),
  isPopular: z.boolean().optional()
})

const itineraryDaySchema = z.object({
  day: z.number().min(1, 'Hari harus positif'),
  title: z.string().min(1, 'Judul hari diperlukan'),
  activities: z.array(z.string().min(1, 'Aktivitas tidak boleh kosong')).min(1, 'Minimal 1 aktivitas diperlukan')
})

export const packageSchema = z.object({
  title: z.string()
    .min(10, 'Judul minimal 10 karakter')
    .max(200, 'Judul maksimal 200 karakter'),
  travelId: z.string().min(1, 'Travel provider diperlukan'),
  description: z.string()
    .min(20, 'Deskripsi minimal 20 karakter')
    .max(2000, 'Deskripsi maksimal 2000 karakter'),
  duration: z.number()
    .min(5, 'Durasi minimal 5 hari')
    .max(30, 'Durasi maksimal 30 hari'),
  departureDate: z.date(),
  returnDate: z.date(),
  departureCity: z.string().optional(),
  quota: z.number()
    .min(1, 'Kuota minimal 1')
    .max(500, 'Kuota maksimal 500')
    .optional(),
  airline: z.string().optional(),
  flightType: z.enum(['Langsung', 'Transit']).optional(),
  pricingTiers: z.array(pricingTierSchema)
    .min(1, 'Minimal 1 pricing tier diperlukan'),
  facilities: z.array(z.string())
    .min(1, 'Minimal 1 fasilitas diperlukan'),
  excludedFacilities: z.array(z.string().min(1)).default([]).optional(),
  itinerary: z.array(itineraryDaySchema)
    .min(1, 'Minimal 1 hari itinerary diperlukan'),
  images: z.array(z.union([z.string(), z.instanceof(File)]))
    .min(3, 'Minimal 3 gambar diperlukan'),
  status: z.enum(['active', 'draft'])
}).refine((data) => data.returnDate > data.departureDate, {
  message: 'Tanggal kembali harus setelah tanggal keberangkatan',
  path: ['returnDate']
})

export type PackageSchemaType = z.infer<typeof packageSchema>
