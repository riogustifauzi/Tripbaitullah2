# 📦 Panduan Deploy Website ke GitHub

## Persiapan Awal

### 1. Pastikan Git Terinstall
Cek apakah Git sudah terinstall di komputer Anda:
```bash
git --version
```

Jika belum terinstall, download dari: https://git-scm.com/downloads

### 2. Konfigurasi Git (Jika Belum)
```bash
git config --global user.name "Nama Anda"
git config --global user.email "email@anda.com"
```

## Langkah-Langkah Deploy

### Step 1: Inisialisasi Git Repository
Buka terminal di folder project ini, lalu jalankan:
```bash
git init
```

### Step 2: Tambahkan Semua File ke Git
```bash
git add .
```

### Step 3: Commit Pertama
```bash
git commit -m "Initial commit: Tripbaitullah website"
```

### Step 4: Buat Repository di GitHub

1. Buka browser dan login ke https://github.com
2. Klik tombol **"+"** di pojok kanan atas
3. Pilih **"New repository"**
4. Isi form:
   - **Repository name**: `tripbaitullah` (atau nama lain yang Anda inginkan)
   - **Description**: "Website Tripbaitullah - Platform Umroh dan Haji"
   - **Visibility**: Pilih **Private** atau **Public**
   - **JANGAN** centang "Initialize this repository with a README"
5. Klik **"Create repository"**

### Step 5: Hubungkan Local Repository ke GitHub

Setelah repository dibuat, GitHub akan menampilkan instruksi. Jalankan perintah berikut (ganti URL dengan URL repository Anda):

```bash
git remote add origin https://github.com/username-anda/tripbaitullah.git
git branch -M main
git push -u origin main
```

**Contoh:**
```bash
git remote add origin https://github.com/riogusti/tripbaitullah.git
git branch -M main
git push -u origin main
```

### Step 6: Masukkan Kredensial GitHub

Saat diminta username dan password:
- **Username**: username GitHub Anda
- **Password**: Gunakan **Personal Access Token** (bukan password biasa)

#### Cara Membuat Personal Access Token:
1. Buka https://github.com/settings/tokens
2. Klik **"Generate new token"** → **"Generate new token (classic)"**
3. Beri nama: `Tripbaitullah Deploy`
4. Pilih scope: **repo** (centang semua)
5. Klik **"Generate token"**
6. **COPY token** yang muncul (hanya muncul sekali!)
7. Gunakan token ini sebagai password saat push

## Update Code ke GitHub (Setelah Ada Perubahan)

Setiap kali ada perubahan code, jalankan:

```bash
# 1. Cek status file yang berubah
git status

# 2. Tambahkan semua perubahan
git add .

# 3. Commit dengan pesan yang jelas
git commit -m "Deskripsi perubahan yang dilakukan"

# 4. Push ke GitHub
git push
```

**Contoh commit message yang baik:**
```bash
git commit -m "Menambahkan fitur filter paket umroh"
git commit -m "Memperbaiki bug pada form login"
git commit -m "Update styling halaman blog"
```

## Tips Penting

### ✅ Yang Harus Di-commit
- Semua source code (src/, public/, dll)
- File konfigurasi (package.json, tsconfig.json, dll)
- README.md dan dokumentasi
- .gitignore

### ❌ Yang TIDAK Boleh Di-commit
- `node_modules/` (sudah di .gitignore)
- `.env` dan `.env.local` (file environment variables)
- File database lokal
- File upload user (jika ada)
- File log dan cache

### 🔒 Keamanan
- **JANGAN** commit file `.env` yang berisi API keys atau password
- **JANGAN** commit kredensial database
- Gunakan environment variables untuk data sensitif

## Clone Repository (Download dari GitHub)

Jika ingin download project di komputer lain:

```bash
# Clone repository
git clone https://github.com/username-anda/tripbaitullah.git

# Masuk ke folder project
cd tripbaitullah

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/username-anda/tripbaitullah.git
```

### Error: "failed to push some refs"
```bash
git pull origin main --rebase
git push origin main
```

### Lupa Commit Sebelum Push
```bash
git add .
git commit -m "Pesan commit"
git push
```

### Lihat History Commit
```bash
git log --oneline
```

### Kembali ke Commit Sebelumnya
```bash
git log --oneline  # Lihat daftar commit
git checkout <commit-hash>  # Kembali ke commit tertentu
```

## Perintah Git yang Sering Digunakan

| Perintah | Fungsi |
|----------|--------|
| `git status` | Cek status file yang berubah |
| `git add .` | Tambahkan semua perubahan |
| `git add <file>` | Tambahkan file tertentu |
| `git commit -m "pesan"` | Commit dengan pesan |
| `git push` | Upload ke GitHub |
| `git pull` | Download perubahan dari GitHub |
| `git log` | Lihat history commit |
| `git branch` | Lihat daftar branch |
| `git checkout -b <nama>` | Buat branch baru |

## Workflow Rekomendasi

### Untuk Development Sendiri:
```bash
# Setiap hari sebelum mulai coding
git pull

# Setelah selesai coding
git add .
git commit -m "Deskripsi perubahan"
git push
```

### Untuk Tim (Menggunakan Branch):
```bash
# Buat branch untuk fitur baru
git checkout -b fitur-payment

# Coding di branch tersebut
git add .
git commit -m "Menambahkan fitur payment"
git push origin fitur-payment

# Merge ke main setelah selesai (via Pull Request di GitHub)
```

## Backup dan Restore

### Backup (Push ke GitHub)
```bash
git add .
git commit -m "Backup: $(date)"
git push
```

### Restore (Clone dari GitHub)
```bash
git clone https://github.com/username-anda/tripbaitullah.git
cd tripbaitullah
npm install
```

## Kontak & Support

Jika ada masalah:
1. Cek dokumentasi Git: https://git-scm.com/doc
2. Cek GitHub Docs: https://docs.github.com
3. Tanya di Stack Overflow: https://stackoverflow.com

---

**Selamat! Website Anda sekarang sudah tersimpan aman di GitHub! 🎉**
