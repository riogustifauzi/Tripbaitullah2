# Fix Page Title & Favicon

## Masalah
- Page title masih menampilkan "Z.ai Code Scaffold - AI-Powered"
- Favicon masih menggunakan logo Z.ai
- Meskipun sudah diubah di admin panel settings

## Solusi

### 1. Update Metadata di layout.tsx
- ✅ Ubah title menjadi "Tripbaitullah - Platform Umroh Terpercaya"
- ✅ Ubah description sesuai bisnis umroh
- ✅ Ubah keywords untuk SEO umroh
- ✅ Ubah favicon dari Z.ai logo ke /logo.svg
- ✅ Update Open Graph metadata
- ✅ Update Twitter Card metadata
- ✅ Ubah lang dari "en" ke "id" (Indonesia)

### 2. Update Favicon Links
- ✅ Tambah link rel="icon" ke /logo.svg
- ✅ Tambah link rel="shortcut icon"
- ✅ Tambah link rel="apple-touch-icon"

### 3. Dynamic Title & Favicon di Homepage
- ✅ Update useEffect untuk set document.title dari settings
- ✅ Tambah logic untuk update favicon secara dinamis dari settings.logo
- ✅ Favicon akan berubah sesuai logo yang di-upload di admin panel

## Hasil

### Sebelum:
```
Title: Z.ai Code Scaffold - AI-Powered Development
Favicon: https://z-cdn.chatglm.cn/z-ai/static/logo.svg
```

### Sesudah:
```
Title: Tripbaitullah - Platform Umroh Terpercaya
Favicon: /logo.svg (atau logo yang di-upload di admin)
```

## Cara Kerja

### Static Metadata (Default)
File: `src/app/layout.tsx`
- Digunakan untuk semua halaman secara default
- Title: "Tripbaitullah - Platform Umroh Terpercaya"
- Favicon: /logo.svg

### Dynamic Metadata (Homepage)
File: `src/app/page.tsx`
- Fetch settings dari API
- Update document.title dengan settings.pageTitle
- Update favicon dengan settings.logo
- Perubahan di admin panel langsung terlihat

## Testing

1. **Buka homepage**: http://localhost:3000
   - Cek tab browser, title harus "Tripbaitullah - Platform Umroh Terpercaya"
   - Cek favicon, harus logo Tripbaitullah

2. **Ubah di admin panel**: http://localhost:3000/paneladmin/settings
   - Ubah "Judul Halaman (Page Title)"
   - Refresh homepage
   - Title harus berubah sesuai yang diinput

3. **Upload logo baru di admin**:
   - Upload logo di settings
   - Refresh homepage
   - Favicon harus berubah sesuai logo baru

## Files Changed

- `src/app/layout.tsx` - Update metadata & favicon links
- `src/app/page.tsx` - Add dynamic favicon update

## Deploy

```bash
git add .
git commit -m "Fix: Update page title dan favicon dari Z.ai ke Tripbaitullah"
git push
```

Vercel akan auto-deploy dalam 1-2 menit.

## Notes

- Favicon menggunakan SVG untuk kualitas terbaik di semua ukuran
- Metadata SEO sudah dioptimasi untuk keyword umroh
- Open Graph & Twitter Card sudah dikonfigurasi untuk social sharing
- Language sudah diubah ke "id" (Indonesia)

---

**Status**: ✅ Fixed
**Date**: November 2025
