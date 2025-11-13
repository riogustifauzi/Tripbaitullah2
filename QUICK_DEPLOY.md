# 🚀 Quick Deploy ke GitHub

## Pertama Kali (Setup)

### 1. Buat Repository di GitHub
- Buka https://github.com/new
- Nama: `tripbaitullah`
- Visibility: Private/Public
- **JANGAN** centang "Initialize with README"
- Klik "Create repository"

### 2. Jalankan Script Deploy
**Cara Mudah (Windows):**
```bash
deploy-github.bat
```

**Atau Manual:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/tripbaitullah.git
git branch -M main
git push -u origin main
```

### 3. Login GitHub
- Username: username GitHub Anda
- Password: **Personal Access Token** (bukan password biasa)
  - Buat di: https://github.com/settings/tokens
  - Scope: pilih **repo**

---

## Update Code (Setelah Ada Perubahan)

```bash
git add .
git commit -m "Deskripsi perubahan"
git push
```

**Atau gunakan script:**
```bash
deploy-github.bat
```

---

## Perintah Penting

| Perintah | Fungsi |
|----------|--------|
| `git status` | Lihat file yang berubah |
| `git add .` | Tambahkan semua perubahan |
| `git commit -m "pesan"` | Simpan perubahan |
| `git push` | Upload ke GitHub |
| `git pull` | Download dari GitHub |
| `git log --oneline` | Lihat history |

---

## Clone di Komputer Lain

```bash
git clone https://github.com/USERNAME/tripbaitullah.git
cd tripbaitullah
npm install
npm run dev
```

---

## Troubleshooting

**Error: "remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/tripbaitullah.git
```

**Error: "failed to push"**
```bash
git pull origin main --rebase
git push
```

**Lupa commit**
```bash
git add .
git commit -m "Update"
git push
```

---

## File yang TIDAK Di-commit

✅ Sudah diatur di `.gitignore`:
- `node_modules/`
- `.env` dan `.env.local`
- `.next/`
- File cache dan log

❌ **JANGAN** commit:
- Password atau API keys
- File database lokal
- File upload user

---

**Baca panduan lengkap di: `PANDUAN_DEPLOY_GITHUB.md`**
