# 🗂️ Setup Vercel Blob Storage untuk Upload Gambar

## 📋 Masalah
Upload gambar di production (Vercel) gagal dengan error 500 karena Vercel tidak support file system operations (tidak bisa simpan file ke disk).

## ✅ Solusi
Menggunakan **Vercel Blob Storage** - cloud storage yang terintegrasi dengan Vercel.

---

## 🚀 Cara Setup di Vercel Dashboard

### 1. Buka Vercel Dashboard
- Login ke https://vercel.com
- Pilih project **Tripbaitullah2**

### 2. Aktifkan Blob Storage
- Klik tab **Storage** di menu samping
- Klik **Create Database**
- Pilih **Blob** (bukan KV atau Postgres)
- Klik **Continue**
- Beri nama: `tripbaitullah-uploads` (atau nama lain)
- Klik **Create**

### 3. Connect ke Project
- Setelah database dibuat, klik **Connect to Project**
- Pilih project **Tripbaitullah2**
- Klik **Connect**

### 4. Environment Variable Otomatis Ditambahkan
Vercel akan otomatis menambahkan environment variable:
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

### 5. Redeploy Project
- Klik tab **Deployments**
- Klik titik tiga (...) di deployment terakhir
- Klik **Redeploy**
- Atau push commit baru ke GitHub (akan auto-deploy)

---

## 🧪 Testing

Setelah setup selesai:

1. **Buka Admin Panel**: https://tripbaitullah2.vercel.app/paneladmin/login
2. **Login** dengan kredensial admin
3. **Buka halaman Blog** atau Hero Slides
4. **Upload gambar** - seharusnya berhasil ✅

---

## 📊 Monitoring Upload

Di Vercel Dashboard > Storage > Blob:
- Lihat semua file yang ter-upload
- Cek storage usage
- Hapus file jika perlu

---

## 💰 Pricing

**Vercel Blob Storage - Hobby Plan (Free):**
- ✅ 1 GB storage
- ✅ 100 GB bandwidth/bulan
- ✅ Cukup untuk website umroh dengan ratusan gambar

**Jika butuh lebih:**
- Pro Plan: $20/bulan (100 GB storage, 1 TB bandwidth)

---

## 🔧 Perubahan Kode

File yang diubah:
- `src/app/api/upload/route.ts` - Ganti file system dengan Vercel Blob
- `package.json` - Tambah dependency `@vercel/blob`

---

## ❓ Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN is not defined"
**Solusi:** 
1. Pastikan Blob Storage sudah di-connect ke project
2. Redeploy project
3. Cek Environment Variables di Vercel Dashboard

### Upload masih gagal setelah setup
**Solusi:**
1. Clear browser cache
2. Cek Vercel logs: Dashboard > Deployments > View Function Logs
3. Pastikan file size < 10MB dan format JPG/PNG/WebP/GIF

---

## 📝 Catatan Penting

⚠️ **Gambar lama di `/public/uploads` tidak akan otomatis pindah ke Blob Storage**

Untuk migrate gambar lama:
1. Upload ulang gambar melalui admin panel, atau
2. Biarkan gambar lama tetap di `/public/uploads` (akan tetap berfungsi di production)

Gambar baru akan otomatis tersimpan di Vercel Blob Storage.

---

## ✅ Checklist Setup

- [ ] Buat Blob Storage di Vercel Dashboard
- [ ] Connect Blob Storage ke project Tripbaitullah2
- [ ] Verifikasi environment variable `BLOB_READ_WRITE_TOKEN` ada
- [ ] Push code baru ke GitHub (atau redeploy manual)
- [ ] Test upload gambar di admin panel
- [ ] Verifikasi gambar muncul di website

---

**Status:** ✅ Kode sudah siap, tinggal setup di Vercel Dashboard
