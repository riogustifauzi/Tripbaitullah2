# ✅ Checklist Sebelum Deploy ke GitHub

## Pre-Deploy Checklist

### 1. File Sensitif
- [ ] Pastikan `.env` sudah ada di `.gitignore`
- [ ] Tidak ada password atau API key di code
- [ ] Tidak ada kredensial database di code
- [ ] File `.env.example` sudah dibuat (tanpa value asli)

### 2. Dependencies
- [ ] `package.json` sudah lengkap
- [ ] `package-lock.json` atau `yarn.lock` ada
- [ ] Tidak ada dependency yang tidak terpakai

### 3. Code Quality
- [ ] Tidak ada console.log yang tidak perlu
- [ ] Tidak ada code yang di-comment berlebihan
- [ ] Tidak ada TODO yang kritis

### 4. Documentation
- [ ] `README.md` sudah ada dan informatif
- [ ] Panduan instalasi sudah jelas
- [ ] Cara menjalankan project sudah dijelaskan

### 5. Git Configuration
- [ ] `.gitignore` sudah lengkap
- [ ] Git sudah terinstall
- [ ] Git config (name & email) sudah diatur

### 6. GitHub Account
- [ ] Sudah punya akun GitHub
- [ ] Sudah login di browser
- [ ] Personal Access Token sudah dibuat (jika perlu)

## Post-Deploy Checklist

### Setelah Push Pertama
- [ ] Repository terlihat di GitHub
- [ ] Semua file penting sudah ter-upload
- [ ] File sensitif TIDAK ter-upload
- [ ] README.md terlihat dengan baik

### Verifikasi
- [ ] Clone repository di folder lain untuk test
- [ ] Jalankan `npm install` berhasil
- [ ] Jalankan `npm run dev` berhasil
- [ ] Website berjalan normal

## File yang Harus Ada di GitHub

✅ **Wajib:**
- `src/` (semua source code)
- `public/` (assets)
- `package.json`
- `tsconfig.json`
- `next.config.js` atau `next.config.mjs`
- `tailwind.config.ts`
- `.gitignore`
- `README.md`

✅ **Opsional tapi Recommended:**
- `PANDUAN_DEPLOY_GITHUB.md`
- `QUICK_DEPLOY.md`
- `.env.example`
- `LICENSE`

❌ **TIDAK Boleh:**
- `node_modules/`
- `.env` atau `.env.local`
- `.next/`
- `out/`
- File database lokal
- File upload user
- File log

## Environment Variables

Jika project menggunakan environment variables, buat file `.env.example`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# API Keys (contoh)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
API_SECRET_KEY=your-secret-key-here

# Upload
UPLOAD_DIR=./public/uploads
```

**Note:** File `.env.example` adalah template tanpa value asli, aman untuk di-commit.

## Security Checklist

- [ ] Tidak ada password di code
- [ ] Tidak ada API key di code
- [ ] Tidak ada token di code
- [ ] Database credentials menggunakan environment variables
- [ ] File `.env` ada di `.gitignore`

## Backup Checklist

Sebelum deploy, pastikan:
- [ ] Sudah backup database lokal (jika ada)
- [ ] Sudah backup file upload user (jika ada)
- [ ] Sudah backup file `.env` di tempat aman

## Ready to Deploy?

Jika semua checklist sudah ✅, Anda siap deploy!

**Jalankan:**
```bash
deploy-github.bat
```

atau ikuti panduan di `QUICK_DEPLOY.md`

---

**Good luck! 🚀**
