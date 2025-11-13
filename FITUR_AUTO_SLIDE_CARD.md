# Fitur Auto-Slide Gambar pada Card Paket Umroh

## Deskripsi
Menambahkan fitur auto-slide gambar pada Card Paket Umroh yang akan aktif saat card di-hover. Gambar akan berganti otomatis setiap 1,5 detik dengan animasi fade yang smooth.

## Perubahan yang Dilakukan

### 1. PackageCard Component (`src/components/PackageCard.tsx`)
- Menambahkan state `fadeIn` untuk mengontrol animasi fade
- Mengupdate logic auto-slide dengan animasi fade yang lebih smooth
- Menambahkan class `rounded-t-lg` pada gambar untuk konsistensi styling
- Transisi opacity 300ms untuk efek fade yang halus

### 2. RelatedPackages Component (`src/components/RelatedPackages.tsx`)
- Membuat komponen baru `PackageCardWithSlider` dengan fitur auto-slide
- Mengupdate data package untuk menggunakan array `images` instead of single `image`
- Menerapkan logic auto-slide yang sama seperti PackageCard

### 3. All Packages Page (`src/app/paket/page.tsx`)
- Membuat komponen baru `PackageCardItem` dengan fitur auto-slide
- Refactor inline card component menjadi reusable component
- Menerapkan logic auto-slide pada semua card di halaman paket

### 4. Homepage (`src/app/page.tsx`)
- Membuat komponen baru `HomePackageCard` dengan fitur auto-slide
- Refactor inline card component menjadi reusable component
- Menerapkan logic auto-slide pada featured packages di homepage

## Cara Kerja

1. **Hover Detection**: Card mendeteksi saat mouse hover menggunakan `onMouseEnter` dan `onMouseLeave`
2. **Auto-Slide**: Saat di-hover, interval timer akan berjalan setiap 1500ms (1,5 detik)
3. **Fade Animation**: 
   - Sebelum ganti gambar, opacity diset ke 0 (200ms)
   - Gambar diganti ke index berikutnya
   - Opacity diset kembali ke 100 (300ms)
4. **Reset**: Saat hover selesai, gambar kembali ke index 0

## Teknologi
- React Hooks: `useState`, `useEffect`
- CSS Transitions: `transition-opacity duration-300`
- Interval Timer: `setInterval` dengan cleanup

## Testing
Untuk menguji fitur ini:
1. Buka halaman http://localhost:3000/paket
2. Hover mouse pada salah satu Card Paket Umroh
3. Gambar akan berganti otomatis setiap 1,5 detik dengan animasi fade
4. Fitur yang sama juga berlaku di:
   - Homepage (Featured Packages)
   - Related Packages di halaman detail paket
   - Semua halaman yang menggunakan PackageCard component

## Catatan
- Fitur hanya aktif jika paket memiliki lebih dari 1 gambar
- Animasi fade menggunakan opacity untuk transisi yang smooth
- Auto-slide akan berhenti saat mouse tidak hover
- Gambar akan reset ke index 0 saat hover selesai
