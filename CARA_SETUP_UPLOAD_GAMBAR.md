# 📸 Cara Setup Upload Gambar di Vercel (5 Menit)

## ❌ Masalah Sekarang
Saat upload gambar di admin panel, muncul error:
```
POST /api/upload 500 (Internal Server Error)
Gagal upload gambar
```

## ✅ Solusi: Setup Vercel Blob Storage

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

### **Step 3: Pilih Blob Storage**
1. Pilih **Blob** (icon gambar/file)
2. **JANGAN pilih** KV atau Postgres
3. Klik **Continue**

---

### **Step 4: Buat Database**
1. **Database Name**: Ketik `tripbaitullah-uploads`
2. Klik **Create**
3. Tunggu beberapa detik sampai selesai

---

### **Step 5: Connect ke Project**
1. Setelah database dibuat, klik **Connect to Project**
2. Pilih project **tripbaitullah2**
3. Klik **Connect**
4. ✅ Selesai! Environment variable otomatis ditambahkan

---

### **Step 6: Redeploy (Otomatis)**
Vercel akan otomatis redeploy project Anda karena ada perubahan di GitHub.

**Atau redeploy manual:**
1. Klik tab **Deployments**
2. Klik titik tiga (...) di deployment terakhir
3. Klik **Redeploy**

---

## ✅ Testing Upload Gambar

Tunggu 1-2 menit sampai deploy selesai, lalu:

1. **Buka**: https://tripbaitullah2.vercel.app/paneladmin/login
2. **Login** dengan username & password admin
3. **Buka halaman Blog** atau Hero Slides
4. **Klik tombol upload gambar**
5. **Pilih gambar** dari komputer
6. **Upload** - seharusnya berhasil! ✅

---

## 📊 Cek Storage Usage

Di Vercel Dashboard > Storage > tripbaitullah-uploads:
- Lihat semua gambar yang ter-upload
- Cek berapa storage yang terpakai
- Hapus gambar jika perlu

---

## 💰 Biaya

**GRATIS untuk Hobby Plan:**
- ✅ 1 GB storage (cukup untuk ratusan gambar)
- ✅ 100 GB bandwidth per bulan
- ✅ Tidak ada biaya tambahan

---

## ❓ Jika Masih Error

### 1. Cek Environment Variable
- Vercel Dashboard > Settings > Environment Variables
- Pastikan ada variable: `BLOB_READ_WRITE_TOKEN`
- Jika tidak ada, ulangi Step 5 (Connect to Project)

### 2. Redeploy Lagi
- Deployments > Redeploy

### 3. Clear Browser Cache
- Tekan `Ctrl + Shift + R` (Windows)
- Atau `Cmd + Shift + R` (Mac)

---

## 📝 Catatan Penting

### Gambar Lama
Gambar yang sudah ada di `/public/uploads` akan tetap berfungsi.
Tidak perlu upload ulang.

### Gambar Baru
Semua gambar baru akan otomatis tersimpan di Vercel Blob Storage (cloud).

### Ukuran File
Maksimal 10 MB per gambar.

### Format Support
✅ JPG, PNG, WebP, GIF

---

## 🎉 Selesai!

Setelah setup, upload gambar akan berfungsi normal di production.

**Butuh bantuan?** Hubungi developer atau cek Vercel logs di Dashboard > Deployments > View Function Logs.
