# 🗄️ Cara Setup Database KV di Vercel (5 Menit)

## ❌ Masalah Sekarang
Upload gambar berhasil, preview muncul, tapi saat klik "Simpan" muncul error:
```
POST /api/hero-slides 500 (Internal Server Error)
```

Karena Vercel tidak support file system untuk database.

## ✅ Solusi: Setup Vercel KV (Redis Database)

---

## 🎯 Langkah-Langkah Setup (Mudah!)

### **Step 1: Buka Vercel Dashboard**
1. Buka browser, ke https://vercel.com
2. Login dengan akun Anda
3. Klik project **tripbaitullah2**

---

### **Step 2: Buka Menu Storage**
1. Di sidebar kiri, klik **Storage**
2. Klik tombol **Create Database**

---

### **Step 3: Pilih KV (Redis)**
1. Pilih **KV** (icon database dengan lightning bolt)
2. **JANGAN pilih** Blob atau Postgres
3. Klik **Continue**

---

### **Step 4: Buat Database**
1. **Database Name**: Ketik `tripbaitullah-kv`
2. **Region**: Pilih **Singapore** atau **Tokyo** (terdekat dengan Indonesia)
3. Klik **Create**
4. Tunggu beberapa detik sampai selesai

---

### **Step 5: Connect ke Project**
1. Setelah database dibuat, klik **Connect to Project**
2. Pilih project **tripbaitullah2**
3. Klik **Connect**
4. ✅ Selesai! Environment variables otomatis ditambahkan

---

### **Step 6: Redeploy (Otomatis)**
Vercel akan otomatis redeploy project Anda karena ada perubahan di GitHub.

**Atau redeploy manual:**
1. Klik tab **Deployments**
2. Klik titik tiga (...) di deployment terakhir
3. Klik **Redeploy**

---

## ✅ Testing Setelah Setup

Tunggu 1-2 menit sampai deploy selesai, lalu:

### **Test 1: Create Hero Slide**
1. **Buka**: https://tripbaitullah2.vercel.app/paneladmin/login
2. **Login** dengan username & password admin
3. **Klik** menu Hero Slides
4. **Klik** Tambah Slide Baru
5. **Upload** gambar
6. **Isi** form (title, subtitle, description, dll)
7. **Klik** Simpan
8. **Expected:** Data tersimpan berhasil! ✅

### **Test 2: Verifikasi di Homepage**
1. **Buka**: https://tripbaitullah2.vercel.app
2. **Cek** hero slider di homepage
3. **Expected:** Slide baru muncul! ✅

### **Test 3: Create Blog**
1. **Buka** menu Blog di admin
2. **Klik** Tambah Blog Baru
3. **Upload** featured image
4. **Isi** form
5. **Klik** Simpan
6. **Expected:** Blog tersimpan berhasil! ✅

---

## 📊 Cek Database

Di Vercel Dashboard > Storage > tripbaitullah-kv:
- Lihat semua data yang tersimpan
- Cek storage usage
- Browse keys (data:hero-slides.json, data:blogs.json, dll)

---

## 💰 Biaya

**GRATIS untuk Hobby Plan:**
- ✅ 256 MB storage (cukup untuk ribuan data)
- ✅ 3,000 commands per hari
- ✅ Tidak ada biaya tambahan

---

## ❓ Jika Masih Error

### 1. Cek Environment Variables
- Vercel Dashboard > Settings > Environment Variables
- Pastikan ada 4 variables KV:
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
  - `KV_REST_API_READ_ONLY_TOKEN`
  - `KV_URL`
- Jika tidak ada, ulangi Step 5 (Connect to Project)

### 2. Redeploy Lagi
- Deployments > Redeploy

### 3. Clear Browser Cache
- Tekan `Ctrl + Shift + R` (Windows)
- Atau `Cmd + Shift + R` (Mac)

### 4. Cek Vercel Logs
- Deployments > [Latest] > View Function Logs
- Lihat error message detail

---

## 📝 Catatan Penting

### **Data Lama Hilang?**
Data di local development (file JSON) **TIDAK otomatis** pindah ke production (KV).

**Solusi:**
- Input ulang data via admin panel production
- Atau export JSON dari local, import ke production (manual)

### **Development vs Production:**
- **Local:** Data di `src/lib/data/*.json` (file system)
- **Production:** Data di Vercel KV (cloud database)
- Keduanya **terpisah** dan tidak sinkron otomatis

### **Backup Data:**
- Data di KV otomatis ter-backup oleh Vercel
- Bisa export via Vercel Dashboard > Storage > KV

---

## 🎉 Selesai!

Setelah setup KV:
- ✅ Upload gambar berfungsi (Vercel Blob)
- ✅ Simpan data berfungsi (Vercel KV)
- ✅ Website fully functional di production!

---

**Butuh bantuan?** Cek Vercel logs atau hubungi developer dengan screenshot error.
