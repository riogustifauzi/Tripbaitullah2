# ⚡ Quick Update Reference

## 🚀 Cara Tercepat Update Code

### Metode 1: Script Otomatis (Recommended)
```bash
update-code.bat
```
atau
```bash
update-code.ps1
```

### Metode 2: Manual (3 Perintah)
```bash
git add .
git commit -m "Deskripsi perubahan"
git push
```

---

## 📝 Template Pesan Commit

### Format:
```
[Tipe]: Deskripsi singkat perubahan
```

### Tipe-tipe Commit:
- **Fix**: Perbaikan bug
- **Feature**: Fitur baru
- **Update**: Update content/styling
- **Refactor**: Perbaikan struktur code
- **Docs**: Update dokumentasi
- **Style**: Perubahan styling saja
- **Test**: Tambah/update test

### Contoh:
```bash
git commit -m "Fix: Error 404 pada halaman travel"
git commit -m "Feature: Tambah filter harga paket"
git commit -m "Update: Styling homepage"
git commit -m "Refactor: Optimasi admin panel"
```

---

## 🔄 Workflow Cepat

```
Edit Code → Save → update-code.bat → Done!
```

Atau:

```
Edit Code → Save → git add . → git commit -m "msg" → git push
```

---

## ⏱️ Timeline Deploy

1. **Push ke GitHub**: Instant
2. **Vercel Detect**: 5-10 detik
3. **Vercel Build**: 30-60 detik
4. **Deploy Live**: 10-20 detik

**Total**: 1-2 menit

---

## 🔍 Cek Status

### GitHub:
https://github.com/riogustifauzi/Tripbaitullah2

### Vercel Dashboard:
https://vercel.com/dashboard

### Website Live:
https://tripbaitullah2.vercel.app

---

## 🆘 Troubleshooting Cepat

### Error: "nothing to commit"
→ Tidak ada perubahan, tidak perlu deploy

### Error: "failed to push"
→ Jalankan: `git pull` lalu `git push`

### Error: "merge conflict"
→ Resolve conflict di editor, lalu:
```bash
git add .
git commit -m "Resolve conflict"
git push
```

### Vercel Deploy Gagal
→ Cek error di Vercel dashboard
→ Fix error, lalu push ulang

---

## 💡 Tips Cepat

✅ **Commit sering** - Jangan tunggu terlalu banyak perubahan
✅ **Test dulu** - Pastikan tidak ada error di localhost
✅ **Pesan jelas** - Jelaskan apa yang diubah
✅ **Pull dulu** - Jika kerja tim

---

## 📱 Shortcut Commands

| Command | Shortcut |
|---------|----------|
| Status | `git status` |
| Add all | `git add .` |
| Commit | `git commit -m "msg"` |
| Push | `git push` |
| Pull | `git pull` |
| Log | `git log --oneline` |

---

## 🎯 Daily Workflow

**Pagi:**
```bash
git pull  # Download perubahan terbaru
```

**Siang (setelah coding):**
```bash
update-code.bat  # Upload perubahan
```

**Sore (setelah coding lagi):**
```bash
update-code.bat  # Upload perubahan
```

---

**Simpan file ini untuk referensi cepat! 📌**
