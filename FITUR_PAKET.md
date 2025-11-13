# Fitur Halaman Paket Umroh

## Halaman yang Telah Dibuat

### 1. Halaman Semua Paket (`/paket`)
Halaman untuk menampilkan semua paket umroh dengan fitur lengkap.

**URL:** `http://localhost:3000/paket`

**Fitur:**
- ✅ Menampilkan 8 paket umroh dengan data lengkap
- ✅ Pencarian berdasarkan nama paket atau travel provider
- ✅ Filter berdasarkan:
  - Kota keberangkatan (Jakarta, Surabaya, Medan, Bandung)
  - Bulan keberangkatan (Januari, Februari, Maret, Desember)
  - Durasi perjalanan (≤7 hari, 8-10 hari, 11-13 hari, ≥14 hari)
  - Rentang harga (slider Rp 0 - Rp 50 juta)
- ✅ Sorting berdasarkan:
  - Paling Populer (berdasarkan jumlah review)
  - Rating Tertinggi
  - Harga Terendah
  - Harga Tertinggi
- ✅ Filter lanjutan dalam side panel (Sheet)
- ✅ Reset semua filter dengan satu klik
- ✅ Tampilan grid responsif (1 kolom mobile, 3-4 kolom desktop)
- ✅ Hover effect dan animasi smooth
- ✅ Menampilkan jumlah hasil pencarian
- ✅ Empty state ketika tidak ada hasil

### 2. Halaman Detail Paket (`/paket/[id]`)
Halaman detail untuk setiap paket umroh.

**URL:** `http://localhost:3000/paket/1` (atau ID lainnya)

**Fitur:**
- ✅ Galeri foto dengan thumbnail
- ✅ Informasi lengkap paket (provider, rating, tanggal, kota, durasi, kuota)
- ✅ Alert untuk kursi yang hampir habis
- ✅ 4 Tab konten:
  - **Itinerary:** Jadwal perjalanan hari per hari
  - **Fasilitas:** Yang termasuk dan tidak termasuk
  - **Syarat:** Persyaratan, pembayaran, kebijakan pembatalan
  - **Ulasan:** Review dari customer dengan rating
- ✅ Sticky booking card dengan:
  - Harga, diskon, dan cashback
  - Tombol "Daftar Sekarang" dan "Hubungi Kami"
  - Highlight keunggulan
  - Badge jaminan keamanan
- ✅ Section paket terkait di bawah
- ✅ Tombol back ke halaman sebelumnya

### 3. Update Landing Page (`/`)
**Fitur yang ditambahkan:**
- ✅ Tombol "Lihat Semua Paket" mengarah ke `/paket`
- ✅ Tombol "Lihat Detail Paket" pada setiap card mengarah ke `/paket/[id]`
- ✅ Semua tombol sudah fungsional

## Cara Menggunakan

### Akses Halaman
1. **Landing Page:** `http://localhost:3000`
2. **Semua Paket:** `http://localhost:3000/paket`
3. **Detail Paket:** `http://localhost:3000/paket/1` (ganti 1 dengan ID paket)

### Menggunakan Filter
1. Gunakan search box untuk mencari nama paket atau travel
2. Pilih kota keberangkatan dari dropdown
3. Pilih bulan keberangkatan
4. Pilih durasi perjalanan
5. Klik "Filter Lanjut" untuk:
   - Mengatur rentang harga dengan slider
   - Mengubah urutan tampilan
   - Reset semua filter

### Navigasi
- Klik card paket untuk melihat detail
- Gunakan tombol back di halaman detail untuk kembali
- Navigasi menu tetap konsisten di semua halaman

## Design System
Semua halaman menggunakan design system yang konsisten:
- Gradient emerald-green untuk branding
- Backdrop blur effect untuk card
- Smooth transitions dan hover effects
- Responsive design untuk mobile dan desktop
- Badge untuk highlight dan status
- Consistent spacing dan typography

## Data Paket
Saat ini menggunakan mock data dengan 8 paket:
1. Umroh Reguler 9 Hari - Jakarta
2. Umroh Plus Turki 12 Hari - Surabaya
3. Umroh Ramadhan 10 Hari - Medan
4. Umroh Ekonomis 7 Hari - Bandung
5. Umroh VIP 14 Hari - Jakarta
6. Umroh Hemat 9 Hari - Surabaya
7. Umroh Plus Dubai 15 Hari - Medan
8. Umroh Keluarga 10 Hari - Bandung

## Teknologi
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React icons
- React hooks (useState, useMemo)
