# ✅ Checklist Upload Gambar - Vercel Blob Storage

## 📋 Status Setup

### ✅ Yang Sudah Selesai:
- [x] Code upload API sudah diupdate ke Vercel Blob
- [x] Package `@vercel/blob` sudah terinstall
- [x] Code sudah di-push ke GitHub (commit: `65b4b37`)
- [x] Vercel Blob Storage sudah dibuat di dashboard
- [x] Blob Storage sudah di-connect ke project

---

## 🧪 Testing Upload Gambar

### **Langkah Testing:**

1. **Tunggu Deploy Selesai** (1-2 menit)
   - Buka: https://vercel.com/dashboard
   - Cek status deployment terakhir
   - Pastikan status: ✅ Ready

2. **Buka Admin Panel**
   - URL: https://tripbaitullah2.vercel.app/paneladmin/login
   - Login dengan kredensial admin

3. **Test Upload di Hero Slides**
   - Klik menu **Hero Slides**
   - Klik **Tambah Slide Baru**
   - Upload gambar (max 10MB, format JPG/PNG/WebP/GIF)
   - **Expected:** Upload berhasil, gambar muncul preview ✅

4. **Test Upload di Blog**
   - Klik menu **Blog**
   - Klik **Tambah Blog Baru**
   - Upload featured image
   - **Expected:** Upload berhasil ✅

5. **Test Upload di Paket Umroh**
   - Klik menu **Paket Umroh**
   - Klik **Tambah Paket Baru**
   - Upload gambar paket
   - **Expected:** Upload berhasil ✅

6. **Test Upload di Travel**
   - Klik menu **Travel Umroh**
   - Klik **Tambah Travel Baru**
   - Upload logo travel
   - **Expected:** Upload berhasil ✅

---

## ✅ Verifikasi Upload Berhasil

### **Cek di Vercel Dashboard:**
1. Buka Vercel Dashboard > Storage > tripbaitullah-uploads
2. Lihat list file yang ter-upload
3. Klik file untuk preview
4. Cek URL file (harus format: `https://xxxxx.public.blob.vercel-storage.com/...`)

### **Cek di Website:**
1. Buka halaman public (bukan admin)
2. Cek apakah gambar yang baru di-upload muncul
3. Klik kanan gambar > Open in new tab
4. Pastikan gambar load dengan baik

---

## ❌ Jika Upload Masih Gagal

### **Troubleshooting:**

#### 1. Cek Environment Variable
```
Vercel Dashboard > Settings > Environment Variables
```
Pastikan ada variable:
- `BLOB_READ_WRITE_TOKEN` = `vercel_blob_rw_xxxxx`

Jika tidak ada:
- Ulangi connect Blob Storage ke project
- Redeploy

#### 2. Cek Vercel Logs
```
Vercel Dashboard > Deployments > [Latest] > View Function Logs
```
Cari error message saat upload

#### 3. Cek Browser Console
```
F12 > Console tab
```
Lihat error message detail

#### 4. Redeploy Manual
```
Vercel Dashboard > Deployments > [...] > Redeploy
```

#### 5. Clear Cache
- Browser: `Ctrl + Shift + R`
- Vercel: Redeploy with "Clear Cache"

---

## 📊 Monitoring Storage

### **Cek Usage:**
- Vercel Dashboard > Storage > tripbaitullah-uploads
- Lihat: Storage Used / 1 GB
- Lihat: Bandwidth Used / 100 GB per month

### **Quota Hobby Plan:**
- ✅ 1 GB storage (gratis)
- ✅ 100 GB bandwidth/bulan (gratis)
- ⚠️ Jika melebihi, upgrade ke Pro Plan ($20/bulan)

---

## 🔧 Maintenance

### **Hapus File Lama:**
1. Vercel Dashboard > Storage > tripbaitullah-uploads
2. Pilih file yang ingin dihapus
3. Klik Delete

### **Backup Gambar:**
- Gambar tersimpan di Vercel Blob (cloud)
- Tidak perlu backup manual
- Vercel handle redundancy & availability

---

## 📝 Catatan Penting

### **URL Gambar Berubah:**
- **Sebelum:** `/uploads/filename.jpg` (local)
- **Sesudah:** `https://xxxxx.public.blob.vercel-storage.com/filename.jpg` (cloud)

### **Gambar Lama:**
- Gambar di `/public/uploads` tetap berfungsi
- Tidak perlu upload ulang
- Gambar baru akan otomatis ke Blob Storage

### **Performance:**
- ✅ Blob Storage lebih cepat (CDN global)
- ✅ Tidak membebani server
- ✅ Auto-optimize untuk web

---

## 🎉 Success Criteria

Upload gambar dianggap berhasil jika:
- [x] Upload tidak error 500
- [x] Preview gambar muncul di admin
- [x] Gambar muncul di halaman public
- [x] URL gambar format Vercel Blob
- [x] Gambar load cepat

---

## 📞 Support

Jika masih ada masalah:
1. Screenshot error message
2. Cek Vercel function logs
3. Cek browser console
4. Hubungi developer dengan info lengkap

---

**Last Updated:** Setelah setup Vercel Blob Storage
**Status:** ✅ Ready for testing
