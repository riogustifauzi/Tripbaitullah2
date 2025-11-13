# 🔄 Panduan Update & Deploy Ulang Code

## 📋 Overview

Setelah website online di GitHub dan Vercel, setiap kali Anda melakukan perubahan code, ikuti langkah berikut untuk deploy ulang.

---

## ⚡ Quick Update (Cara Tercepat)

### Menggunakan Script Otomatis

**1. Edit code Anda seperti biasa**
**2. Save semua file**
**3. Double-click file ini:**
```
deploy-github.bat
```

**4. Masukkan pesan perubahan** (contoh: "Memperbaiki bug login")
**5. Selesai!** Vercel akan otomatis deploy dalam 1-2 menit

---

## 📝 Manual Update (Step by Step)

### Langkah 1: Cek File yang Berubah
```bash
git status
```

Output akan menampilkan file yang berubah:
```
modified:   src/app/page.tsx
modified:   src/components/PackageCard.tsx
```

### Langkah 2: Tambahkan Perubahan
```bash
# Tambahkan semua file yang berubah
git add .

# Atau tambahkan file tertentu saja
git add src/app/page.tsx
git add src/components/PackageCard.tsx
```

### Langkah 3: Commit dengan Pesan
```bash
git commit -m "Deskripsi perubahan yang dilakukan"
```

**Contoh pesan commit yang baik:**
```bash
git commit -m "Memperbaiki bug pada form login"
git commit -m "Menambahkan fitur filter paket umroh"
git commit -m "Update styling halaman blog"
git commit -m "Fix: Error 404 pada halaman travel"
git commit -m "Feature: Tambah tombol share paket"
```

### Langkah 4: Push ke GitHub
```bash
git push
```

### Langkah 5: Tunggu Vercel Auto-Deploy
- Vercel akan otomatis detect perubahan di GitHub
- Deploy biasanya selesai dalam 1-2 menit
- Cek status di: https://vercel.com/dashboard

---

## 🎯 Workflow Harian

```
┌─────────────────────────────────────────┐
│  1. Buka project di editor              │
│     ↓                                   │
│  2. Edit code (tambah fitur/fix bug)    │
│     ↓                                   │
│  3. Test di localhost (npm run dev)     │
│     ↓                                   │
│  4. Save semua file                     │
│     ↓                                   │
│  5. Jalankan deploy-github.bat          │
│     ↓                                   │
│  6. Masukkan pesan commit               │
│     ↓                                   │
│  7. Tunggu Vercel auto-deploy           │
│     ↓                                   │
│  8. Cek website di production           │
│     ↓                                   │
│  9. Selesai! ✓                          │
└─────────────────────────────────────────┘
```

---

## 🔄 Skenario Update

### Skenario 1: Update Styling
```bash
# 1. Edit file CSS/Tailwind
# 2. Test di localhost
# 3. Deploy
git add .
git commit -m "Update: Styling halaman homepage"
git push
```

### Skenario 2: Fix Bug
```bash
# 1. Fix bug di code
# 2. Test untuk memastikan bug teratasi
# 3. Deploy
git add .
git commit -m "Fix: Error pada form submit paket"
git push
```

### Skenario 3: Tambah Fitur Baru
```bash
# 1. Buat fitur baru
# 2. Test fitur
# 3. Deploy
git add .
git commit -m "Feature: Tambah filter harga pada paket umroh"
git push
```

### Skenario 4: Update Content/Data
```bash
# 1. Update data di JSON files
# 2. Deploy
git add .
git commit -m "Update: Data paket umroh terbaru"
git push
```

### Skenario 5: Update Multiple Files
```bash
# 1. Edit beberapa file
# 2. Test semua perubahan
# 3. Deploy
git add .
git commit -m "Update: Perbaikan UI dan penambahan fitur search"
git push
```

---

## 🚀 Vercel Auto-Deploy

### Cara Kerja:
1. Anda push code ke GitHub
2. Vercel detect perubahan otomatis
3. Vercel build & deploy otomatis
4. Website langsung update (1-2 menit)

### Cek Status Deploy:
- Dashboard Vercel: https://vercel.com/dashboard
- Lihat log build
- Lihat preview deployment
- Cek error jika ada

### Jika Deploy Gagal:
1. Cek error di Vercel dashboard
2. Fix error di code
3. Push ulang ke GitHub
4. Vercel akan auto-deploy lagi

---

## 📊 Git Commands Cheat Sheet

| Command | Fungsi | Contoh |
|---------|--------|--------|
| `git status` | Lihat file yang berubah | `git status` |
| `git add .` | Tambah semua perubahan | `git add .` |
| `git add <file>` | Tambah file tertentu | `git add src/app/page.tsx` |
| `git commit -m "msg"` | Commit dengan pesan | `git commit -m "Fix bug"` |
| `git push` | Upload ke GitHub | `git push` |
| `git pull` | Download dari GitHub | `git pull` |
| `git log` | Lihat history commit | `git log --oneline` |
| `git diff` | Lihat perubahan detail | `git diff` |

---

## 💡 Tips Best Practices

### ✅ DO (Lakukan):
- **Commit sering** - Jangan tunggu terlalu banyak perubahan
- **Pesan commit jelas** - Jelaskan apa yang diubah
- **Test dulu di localhost** - Pastikan tidak ada error
- **Pull sebelum push** - Jika kerja tim
- **Backup data penting** - Sebelum perubahan besar

### ❌ DON'T (Jangan):
- **Commit file .env** - Sudah di .gitignore
- **Commit node_modules** - Sudah di .gitignore
- **Push code yang error** - Test dulu!
- **Pesan commit tidak jelas** - "update" atau "fix" saja
- **Lupa pull** - Jika kerja tim

---

## 🔍 Troubleshooting

### Error: "Your local changes would be overwritten"
```bash
# Simpan perubahan lokal dulu
git stash
git pull
git stash pop
```

### Error: "failed to push some refs"
```bash
# Pull dulu, baru push
git pull --rebase
git push
```

### Error: "merge conflict"
```bash
# Resolve conflict di editor
# Lalu:
git add .
git commit -m "Resolve merge conflict"
git push
```

### Lupa Commit Message
```bash
# Ubah commit message terakhir
git commit --amend -m "Pesan baru yang lebih jelas"
git push --force
```

### Ingin Undo Commit Terakhir
```bash
# Undo commit tapi keep changes
git reset --soft HEAD~1

# Undo commit dan discard changes
git reset --hard HEAD~1
```

---

## 📱 Update dari Komputer Lain

Jika Anda kerja dari komputer berbeda:

### Pertama Kali:
```bash
# Clone repository
git clone https://github.com/riogustifauzi/Tripbaitullah2.git
cd Tripbaitullah2

# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

### Setiap Kali Mulai Kerja:
```bash
# Pull perubahan terbaru
git pull

# Mulai coding...
```

### Setelah Selesai:
```bash
# Push perubahan
git add .
git commit -m "Deskripsi perubahan"
git push
```

---

## 🎓 Workflow Tim (Jika Ada)

### Branch Strategy:
```bash
# Buat branch untuk fitur baru
git checkout -b fitur-payment

# Coding di branch tersebut
git add .
git commit -m "Tambah fitur payment"
git push origin fitur-payment

# Merge ke main via Pull Request di GitHub
```

### Pull Request Workflow:
1. Buat branch baru untuk fitur
2. Push branch ke GitHub
3. Buat Pull Request di GitHub
4. Review code
5. Merge ke main
6. Vercel auto-deploy

---

## 📋 Checklist Sebelum Deploy

- [ ] Code sudah di-test di localhost
- [ ] Tidak ada error di console
- [ ] Tidak ada console.log yang tidak perlu
- [ ] File .env tidak ter-commit
- [ ] Pesan commit sudah jelas
- [ ] Sudah pull perubahan terbaru (jika tim)

---

## 🎯 Quick Reference

### Update Code Cepat:
```bash
git add .
git commit -m "Update: deskripsi perubahan"
git push
```

### Atau Gunakan Script:
```bash
deploy-github.bat
```

### Cek Status Vercel:
https://vercel.com/dashboard

---

## 📞 Bantuan

Jika ada masalah:
1. Cek error message dengan teliti
2. Google error message tersebut
3. Cek Vercel deployment logs
4. Tanya di Stack Overflow
5. Baca dokumentasi Git: https://git-scm.com/doc

---

**Selamat Coding! Happy Deploying! 🚀**

---

*Last updated: November 2025*
