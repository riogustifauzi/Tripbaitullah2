# 🗄️ Setup Vercel KV (Redis) untuk Database

## 📋 Masalah
Setelah upload gambar berhasil, menyimpan data hero slide/blog/paket gagal dengan error 500 karena Vercel tidak support file system operations untuk database.

## ✅ Solusi
Menggunakan **Vercel KV (Redis)** - database key-value yang terintegrasi dengan Vercel untuk menyimpan data JSON.

---

## 🚀 Cara Setup di Vercel Dashboard

### **Step 1: Buka Vercel Dashboard**
1. Login ke https://vercel.com
2. Pilih project **tripbaitullah2**

---

### **Step 2: Buka Menu Storage**
1. Di sidebar kiri, klik **Storage**
2. Klik tombol **Create Database**

---

### **Step 3: Pilih KV (Redis)**
1. Pilih **KV** (icon database dengan lightning)
2. **JANGAN pilih** Blob atau Postgres
3. Klik **Continue**

---

### **Step 4: Buat Database**
1. **Database Name**: Ketik `tripbaitullah-kv`
2. **Region**: Pilih yang terdekat (Singapore/Tokyo untuk Indonesia)
3. Klik **Create**
4. Tunggu beberapa detik sampai selesai

---

### **Step 5: Connect ke Project**
1. Setelah database dibuat, klik **Connect to Project**
2. Pilih project **tripbaitullah2**
3. Klik **Connect**
4. ✅ Selesai! Environment variables otomatis ditambahkan:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
   - `KV_URL`

---

### **Step 6: Migrate Data (Opsional)**
Jika sudah ada data di local development, perlu migrate ke KV:

**Opsi 1: Input Manual via Admin Panel**
- Login ke admin panel production
- Input ulang data hero slides, blog, paket, travel

**Opsi 2: Migrate via Script (Advanced)**
- Buat script untuk copy data dari JSON files ke KV
- Jalankan sekali saja untuk initial migration

---

### **Step 7: Redeploy**
Vercel akan otomatis redeploy project karena ada perubahan di GitHub.

**Atau redeploy manual:**
1. Klik tab **Deployments**
2. Klik titik tiga (...) di deployment terakhir
3. Klik **Redeploy**

---

## ✅ Testing

Tunggu 1-2 menit sampai deploy selesai, lalu:

1. **Buka**: https://tripbaitullah2.vercel.app/paneladmin/login
2. **Login** dengan username & password admin
3. **Test Create Hero Slide:**
   - Klik menu Hero Slides
   - Klik Tambah Slide Baru
   - Upload gambar
   - Isi form
   - Klik Simpan
   - **Expected:** Data tersimpan berhasil ✅

4. **Test Create Blog:**
   - Klik menu Blog
   - Klik Tambah Blog Baru
   - Upload featured image
   - Isi form
   - Klik Simpan
   - **Expected:** Data tersimpan berhasil ✅

5. **Verifikasi di Homepage:**
   - Buka https://tripbaitullah2.vercel.app
   - Hero slider seharusnya muncul dengan data baru ✅

---

## 📊 Monitoring KV Database

Di Vercel Dashboard > Storage > tripbaitullah-kv:
- Lihat semua keys yang tersimpan
- Cek data usage
- Browse data (key-value pairs)

**Keys yang akan ada:**
- `data:hero-slides.json` - Data hero slides
- `data:blogs.json` - Data blog articles
- `data:packages.json` - Data paket umroh
- `data:travels.json` - Data travel umroh
- `data:users.json` - Data users admin

---

## 💰 Pricing

**Vercel KV - Hobby Plan (Free):**
- ✅ 256 MB storage
- ✅ 3,000 commands/day
- ✅ Cukup untuk website dengan ratusan data

**Jika butuh lebih:**
- Pro Plan: $20/bulan (512 MB, 100K commands/day)

---

## 🔧 Perubahan Kode

File yang diubah:
- `src/lib/utils/data-access.ts` - Support both file system (dev) dan KV (production)
- `package.json` - Tambah dependency `@vercel/kv`

**Cara Kerja:**
```typescript
// Development (local): Gunakan file system
if (!IS_PRODUCTION) {
  fs.readFile('src/lib/data/hero-slides.json')
}

// Production (Vercel): Gunakan KV
if (IS_PRODUCTION) {
  kv.get('data:hero-slides.json')
}
```

---

## ❓ Troubleshooting

### Error: "KV_REST_API_URL is not defined"
**Solusi:** 
1. Pastikan KV Database sudah di-connect ke project
2. Redeploy project
3. Cek Environment Variables di Vercel Dashboard

### Data tidak tersimpan setelah setup
**Solusi:**
1. Clear browser cache
2. Cek Vercel logs: Dashboard > Deployments > View Function Logs
3. Pastikan environment variables KV sudah ada
4. Redeploy dengan "Clear Cache"

### Data lama hilang
**Solusi:**
- Data di local development (file JSON) tidak otomatis migrate ke KV
- Perlu input ulang data via admin panel production
- Atau buat script migration (advanced)

---

## 📝 Catatan Penting

### **Development vs Production:**
- **Local Development:** Data tersimpan di `src/lib/data/*.json` (file system)
- **Production (Vercel):** Data tersimpan di Vercel KV (Redis cloud)
- Keduanya **TIDAK sinkron otomatis**

### **Data Separation:**
Data di local dan production terpisah. Jika ingin sama:
1. Export data dari local (JSON files)
2. Import ke production via admin panel
3. Atau buat script migration

### **Backup Data:**
- Data di KV otomatis ter-backup oleh Vercel
- Bisa export data via Vercel Dashboard > Storage > KV > Browse
- Atau via admin panel (export feature - jika ada)

---

## ✅ Checklist Setup

- [ ] Buat KV Database di Vercel Dashboard
- [ ] Connect KV Database ke project tripbaitullah2
- [ ] Verifikasi environment variables KV ada (4 variables)
- [ ] Push code baru ke GitHub (atau redeploy manual)
- [ ] Test create hero slide di admin panel
- [ ] Test create blog di admin panel
- [ ] Verifikasi data muncul di homepage
- [ ] (Opsional) Migrate data lama dari local ke production

---

**Status:** ✅ Kode sudah siap, tinggal setup di Vercel Dashboard
**Commit:** `[akan di-push]`
**Deploy:** Otomatis via GitHub push
