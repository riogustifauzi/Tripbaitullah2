# 🔧 Fix Upload Image Error 400

## ❌ Masalah
Setelah setup Vercel Blob Storage, upload gambar berhasil tapi gambar tidak muncul dengan error:
```
GET https://tripbaitullah2.vercel.app/_next/image?url=https%3A%2F%2F...blob.vercel-storage.com%2F... 400 (Bad Request)
```

## 🔍 Penyebab
Next.js Image component memerlukan **whitelist domain** untuk external images. Vercel Blob Storage domain (`*.public.blob.vercel-storage.com`) belum ditambahkan ke config.

## ✅ Solusi
Tambahkan Vercel Blob domain ke `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.public.blob.vercel-storage.com',
    },
  ],
}
```

## 📝 Perubahan
File: `next.config.ts`
- Tambah section `images.remotePatterns`
- Whitelist semua subdomain Vercel Blob Storage

## 🚀 Deploy
```bash
git add .
git commit -m "Fix: Tambah Vercel Blob domain ke Next.js image config"
git push
```

Vercel akan auto-deploy dalam 1-2 menit.

## ✅ Testing
Setelah deploy selesai:
1. Buka admin panel
2. Upload gambar baru di Hero Slides/Blog/Paket/Travel
3. Gambar seharusnya muncul dengan benar ✅

## 📊 Verifikasi
- Upload berhasil (no error 500)
- Preview gambar muncul di admin
- Gambar muncul di halaman public
- No error 400 di browser console

---

**Status:** ✅ Fixed
**Commit:** `1c2143d`
**Deploy:** Otomatis via GitHub push
