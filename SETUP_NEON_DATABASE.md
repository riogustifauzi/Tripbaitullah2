# 🐘 Setup Neon PostgreSQL Database

## ✅ Yang Sudah Selesai
- [x] Database Neon sudah dibuat
- [x] Code sudah diupdate untuk menggunakan Neon PostgreSQL
- [x] Dependencies `@neondatabase/serverless` sudah terinstall

---

## 🎯 Langkah Selanjutnya

### **Step 1: Copy DATABASE_URL dari Neon**

1. **Buka Neon Dashboard** (screenshot yang Anda kirim)
2. **Klik tab `.env.local`** di bagian Quickstart
3. **Copy** value `DATABASE_URL` (yang di-blur dengan bintang)
   - Format: `postgresql://username:password@host/database?sslmode=require`

---

### **Step 2: Tambahkan ke Vercel Environment Variables**

1. **Buka** Vercel Dashboard: https://vercel.com
2. **Pilih project** tripbaitullah2
3. **Klik** Settings
4. **Klik** Environment Variables
5. **Klik** Add New
6. **Name**: `DATABASE_URL`
7. **Value**: Paste DATABASE_URL dari Neon
8. **Environment**: Pilih semua (Production, Preview, Development)
9. **Klik** Save

---

### **Step 3: Initialize Database Schema**

Ada 2 cara untuk membuat tables di Neon:

#### **Cara 1: Via Neon SQL Editor (Recommended)**

1. **Buka** Neon Dashboard
2. **Klik** SQL Editor (di sidebar)
3. **Copy** isi file `src/lib/db/schema.sql`
4. **Paste** ke SQL Editor
5. **Klik** Run
6. **Tunggu** sampai semua tables dibuat ✅

#### **Cara 2: Via psql (Advanced)**

```bash
# Install psql jika belum ada
# Windows: Download dari PostgreSQL website
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql-client

# Connect ke Neon
psql "postgresql://username:password@host/database?sslmode=require"

# Run schema file
\i src/lib/db/schema.sql
```

---

### **Step 4: Redeploy Vercel**

1. **Klik** tab Deployments
2. **Klik** titik tiga (...) di deployment terakhir
3. **Klik** Redeploy
4. **Tunggu** sampai status Ready (1-2 menit)

---

## ✅ Testing

Setelah redeploy selesai:

### **Test 1: Create Travel**
1. Login ke admin panel
2. Klik menu Travel Umroh
3. Klik Tambah Travel Baru
4. Upload logo
5. Isi form
6. Klik Simpan
7. **Expected:** Data tersimpan ke PostgreSQL! ✅

### **Test 2: Create Hero Slide**
1. Klik menu Hero Slides
2. Klik Tambah Slide Baru
3. Upload gambar
4. Isi form
5. Klik Simpan
6. **Expected:** Data tersimpan! ✅

### **Test 3: Verifikasi di Neon**
1. Buka Neon Dashboard
2. Klik Tables
3. Klik table `travels` atau `hero_slides`
4. **Expected:** Data baru muncul! ✅

---

## 📊 Database Schema

Tables yang dibuat:
- `hero_slides` - Hero slider homepage
- `blogs` - Blog articles
- `travels` - Travel umroh providers
- `packages` - Paket umroh
- `users` - Admin users
- `settings` - Site-wide settings

---

## 💰 Biaya

**Neon Free Tier:**
- ✅ 512 MB storage
- ✅ 1 project
- ✅ 10 branches
- ✅ Unlimited queries
- ✅ GRATIS selamanya!

**Jika butuh lebih:**
- Pro Plan: $19/bulan (3 GB storage)

---

## 🔄 Migration Data Lama (Opsional)

Jika ada data di local development yang ingin dipindahkan:

### **Cara Manual:**
1. Export data dari `src/lib/data/*.json`
2. Input ulang via admin panel production

### **Cara Script (Advanced):**
Buat script Node.js untuk:
1. Read JSON files
2. Insert ke PostgreSQL via Neon API

---

## 📝 Keuntungan Neon PostgreSQL

✅ **Serverless** - Auto-scale, pay per use
✅ **Fast** - Low latency, global CDN
✅ **Reliable** - Auto-backup, point-in-time recovery
✅ **PostgreSQL** - Full SQL support, ACID compliant
✅ **Free Tier** - Generous limits untuk small projects

---

## ❓ Troubleshooting

### **Error: "Database not configured"**
**Solusi:**
1. Pastikan `DATABASE_URL` sudah ditambahkan ke Vercel
2. Redeploy project
3. Cek Environment Variables

### **Error: "relation does not exist"**
**Solusi:**
1. Pastikan schema sudah di-run (Step 3)
2. Cek di Neon Dashboard > Tables
3. Re-run schema.sql jika perlu

### **Data tidak tersimpan**
**Solusi:**
1. Cek Vercel logs untuk error detail
2. Pastikan DATABASE_URL benar
3. Test connection di Neon Dashboard

---

## 🎉 Selesai!

Setelah setup Neon:
- ✅ Upload gambar berfungsi (Vercel Blob)
- ✅ Database berfungsi (Neon PostgreSQL)
- ✅ Website fully functional!
- ✅ Data persistent dan scalable!

---

**Next Steps:**
1. Copy DATABASE_URL dari Neon
2. Tambahkan ke Vercel Environment Variables
3. Run schema.sql di Neon SQL Editor
4. Redeploy Vercel
5. Test create data di admin panel

**Butuh bantuan?** Screenshot error dan cek Vercel logs.
