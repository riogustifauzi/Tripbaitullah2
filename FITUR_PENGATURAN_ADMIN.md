# Fitur Pengaturan Admin

## Deskripsi
Menambahkan menu "Pengaturan" pada Panel Admin untuk mengelola konfigurasi situs seperti logo, favicon, judul web, dan konten footer.

## Fitur yang Ditambahkan

### 1. Menu Pengaturan di Sidebar
- Menambahkan menu "Pengaturan" dengan icon Settings di sidebar admin
- Menu terletak di bagian bawah setelah Hero Slides
- Route: `/admin/settings`

### 2. Halaman Pengaturan
Halaman pengaturan dibagi menjadi 3 section:

#### A. Informasi Situs
- **Nama Situs**: Nama yang ditampilkan di header dan title browser
- Validasi: Wajib diisi, maksimal 100 karakter

#### B. Branding
- **Logo Situs**: Logo yang ditampilkan di header dan sidebar admin
  - Upload gambar dengan ImageUpload component
  - Format: JPG, PNG, WebP
  - Maksimal 10MB
  
- **Favicon**: Icon yang ditampilkan di tab browser
  - Upload gambar dengan ImageUpload component
  - Rekomendasi ukuran: 16x16 atau 32x32 px
  - Format: JPG, PNG, WebP, ICO

#### C. Konten Footer
- **Deskripsi**: Teks deskripsi tentang platform (maksimal 500 karakter)
- **Nomor Telepon**: Nomor kontak yang ditampilkan di footer (maksimal 20 karakter)
- **Email**: Alamat email kontak (validasi format email)
- **Alamat**: Alamat kantor/lokasi (maksimal 200 karakter)

## File yang Dibuat

### 1. Types
- `src/types/settings.ts` - Interface untuk Settings dan SettingsFormData

### 2. Validation Schema
- `src/lib/validations/settings.schema.ts` - Zod schema untuk validasi form

### 3. API Routes
- `src/app/api/settings/route.ts` - API endpoint untuk GET dan PUT settings
  - GET `/api/settings` - Mengambil data pengaturan
  - PUT `/api/settings` - Menyimpan perubahan pengaturan

### 4. Components
- `src/components/admin/forms/SettingsForm.tsx` - Form component untuk edit settings

### 5. Pages
- `src/app/admin/settings/page.tsx` - Halaman pengaturan admin

### 6. Data Storage
- `data/settings.json` - File JSON untuk menyimpan pengaturan (auto-generated)

## File yang Dimodifikasi

### 1. AdminSidebar
- `src/components/admin/AdminSidebar.tsx`
  - Menambahkan import icon Settings
  - Menambahkan menu item "Pengaturan"

## Cara Kerja

### 1. Penyimpanan Data
- Data pengaturan disimpan dalam file JSON di `data/settings.json`
- Jika file tidak ada, sistem akan membuat file dengan default settings
- Default settings:
  ```json
  {
    "id": 1,
    "siteName": "Tripbaitullah",
    "logo": "/logo.svg",
    "favicon": "/favicon.ico",
    "footerAbout": "Platform terpercaya untuk menemukan paket umroh terbaik...",
    "footerPhone": "+62 812-3456-7890",
    "footerEmail": "info@tripbaitullah.com",
    "footerAddress": "Jakarta, Indonesia"
  }
  ```

### 2. Upload Gambar
- Menggunakan komponen ImageUpload yang sudah ada
- Gambar di-upload ke `/api/upload`
- URL gambar disimpan di settings

### 3. Validasi
- Validasi dilakukan di client-side (Zod schema)
- Validasi juga dilakukan di server-side (API route)
- Error ditampilkan di bawah setiap field

### 4. Update Settings
- Form submit ke API `/api/settings` dengan method PUT
- API memvalidasi data dan menyimpan ke file JSON
- Setelah berhasil, halaman di-reload untuk menerapkan perubahan

## Cara Menggunakan

1. Login ke Panel Admin
2. Klik menu "Pengaturan" di sidebar
3. Edit field yang ingin diubah:
   - Nama Situs
   - Upload Logo baru (opsional)
   - Upload Favicon baru (opsional)
   - Edit konten footer (deskripsi, telepon, email, alamat)
4. Klik tombol "Simpan Pengaturan"
5. Halaman akan reload dan perubahan akan diterapkan

## Validasi Form

### Nama Situs
- Wajib diisi
- Minimal 1 karakter
- Maksimal 100 karakter

### Logo & Favicon
- Harus berupa URL yang valid
- Opsional (bisa kosong)

### Deskripsi Footer
- Wajib diisi
- Minimal 1 karakter
- Maksimal 500 karakter

### Nomor Telepon
- Wajib diisi
- Minimal 1 karakter
- Maksimal 20 karakter

### Email
- Wajib diisi
- Harus format email yang valid

### Alamat
- Wajib diisi
- Minimal 1 karakter
- Maksimal 200 karakter

## Integrasi dengan Frontend

Untuk menggunakan settings di frontend, fetch data dari API:

```typescript
const response = await fetch('/api/settings')
const settings = await response.json()

// Gunakan settings
console.log(settings.siteName)
console.log(settings.logo)
console.log(settings.footerAbout)
```

## Catatan Penting

1. **File Permissions**: Pastikan folder `data/` memiliki permission untuk write
2. **Default Values**: Jika file settings.json tidak ada, sistem akan membuat dengan default values
3. **Reload Required**: Setelah save, halaman akan reload untuk menerapkan perubahan
4. **Image Upload**: Gambar di-upload terlebih dahulu sebelum disimpan di settings
5. **Validation**: Semua field divalidasi di client dan server untuk keamanan

## Testing

1. Akses halaman: http://localhost:3000/admin/settings
2. Test upload logo baru
3. Test upload favicon baru
4. Test edit semua field footer
5. Test validasi (kosongkan field required)
6. Test save dan verify perubahan diterapkan

## Future Enhancements

Fitur yang bisa ditambahkan di masa depan:
- Social media links (Facebook, Instagram, Twitter, WhatsApp)
- SEO settings (meta description, keywords)
- Google Analytics ID
- Contact form email recipient
- Business hours
- Multiple language support
- Theme customization (colors, fonts)
