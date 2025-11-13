# Update Pricing Tiers & Display - Paket Umroh

## Perubahan yang Dilakukan

### A. Menambahkan field baru pada Pricing Tiers untuk paket umroh:

### 1. Field Baru yang Ditambahkan:
- **Harga Coret (originalPrice)** - Opsional
  - Untuk menampilkan harga sebelum diskon
  - Akan ditampilkan dengan garis coret di UI
  
- **Cashback** - Opsional
  - Untuk menampilkan cashback yang didapat
  - Akan ditampilkan sebagai badge merah di card paket

### 2. File yang Diupdate:

#### Type Definition (`src/types/package.ts`):
```typescript
export interface PricingTier {
  name: string
  price: number
  originalPrice?: number // Harga coret (baru)
  cashback?: number // Cashback (baru)
  hotelMakkah: string
  hotelMadinah: string
  roomType: string
  additionalFacilities: string[]
}
```

#### Validation Schema (`src/lib/validations/package.schema.ts`):
- Menambahkan validasi untuk `originalPrice` dan `cashback` (optional, min 0)

#### Form Component (`src/components/admin/forms/PackageForm.tsx`):
- Menambahkan input field untuk Harga Coret
- Menambahkan input field untuk Cashback
- Memperbaiki layout form dengan label yang lebih jelas
- Menambahkan default value untuk field baru

#### Display Pages:
- **Landing Page** (`src/app/page.tsx`): Menampilkan harga coret dan cashback badge
- **Package List** (`src/app/paket/page.tsx`): Menampilkan harga coret dan cashback badge

### 3. Cara Penggunaan:

1. Buka Admin Panel → Paket Umroh → Tambah/Edit Paket
2. Di section "Pricing Tiers", setiap tier sekarang memiliki:
   - **Harga Normal*** (wajib)
   - **Harga Coret** (opsional) - Isi jika ada harga sebelum diskon
   - **Cashback** (opsional) - Isi jika ada cashback
   - **Tipe Kamar*** (wajib)
   - **Hotel Makkah*** (wajib)
   - **Hotel Madinah*** (wajib)

### 4. Tampilan di Frontend:

#### Jika ada Harga Coret:
```
Rp 22.500.000
Rp 23.500.000 (dengan garis coret)
Mulai dari
```

#### Jika ada Cashback:
```
Badge merah: "Cashback Rp 1.000.000"
```

### 5. Catatan:
- Field `originalPrice` dan `cashback` bersifat opsional
- Harga coret hanya ditampilkan jika nilainya lebih besar dari harga normal
- Cashback hanya ditampilkan jika nilainya lebih dari 0
- Semua field harga menggunakan format Rupiah Indonesia

---

### B. Perubahan Tampilan Card Paket:

#### 1. Menghapus Badge Kuota/Kursi:
- Badge "45 kursi" atau "Sisa Sedikit" telah dihapus dari card paket
- Sekarang hanya menampilkan badge "Tersedia" di pojok kanan atas gambar

#### 2. Menghapus Field Input Kuota di Admin Panel:
- Field input "Kuota" telah dihapus dari form admin
- Sistem otomatis menggunakan default quota = 999 (tidak ditampilkan ke user)

#### 3. Cashback Menampilkan Nilai Terbesar:
- Sistem sekarang mencari cashback terbesar dari semua pricing tiers
- Menampilkan cashback maksimal yang bisa didapat user
- Contoh: Jika tier Standard cashback Rp 500.000 dan tier Premium cashback Rp 1.000.000, maka yang ditampilkan adalah Rp 1.000.000

#### Tampilan Baru di Card:
```
┌─────────────────────────────┐
│  [Gambar Paket]   [Tersedia]│
├─────────────────────────────┤
│ Silversilk Tour ✓           │
│ Umroh Reguler Percobaan     │
│                             │
│ 📅 10 November 2025         │
│ 📍 Pekanbaru                │
│ ⏰ 9 Hari                   │
├─────────────────────────────┤
│ Rp 22.500.000  [Cashback   │
│ Rp 30.000.000   Rp 1.000.000]│
│ Mulai dari                  │
│                             │
│ [Lihat Detail]              │
└─────────────────────────────┘
```

#### File yang Diupdate untuk Perubahan Ini:
- `src/app/page.tsx` - Landing page
- `src/app/paket/page.tsx` - Package listing page
- `src/components/admin/forms/PackageForm.tsx` - Admin form

#### Logika Cashback Terbesar:
```typescript
const highestCashback = Math.max(...pkg.pricingTiers.map(t => t.cashback || 0))
```

Cashback hanya ditampilkan jika `highestCashback > 0`
