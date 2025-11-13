# 🔄 Workflow Update Code - Visual Guide

## 📊 Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT WORKFLOW                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐
│  1. CODING   │  Edit code di editor (VS Code, dll)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  2. TESTING  │  npm run dev → Test di localhost:3000
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  3. SAVE     │  Save semua file (Ctrl+S)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  4. COMMIT   │  git add . → git commit -m "msg"
└──────┬───────┘  atau jalankan: update-code.bat
       │
       ▼
┌──────────────┐
│  5. PUSH     │  git push → Upload ke GitHub
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  6. DEPLOY   │  Vercel auto-detect & deploy (1-2 menit)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  7. LIVE     │  Website update di production
└──────────────┘
```

---

## 🎯 Workflow Scenarios

### Scenario A: Quick Fix (5 menit)

```
Bug ditemukan → Fix code → Test → Push → Live
     ↓              ↓         ↓      ↓      ↓
  1 menit       1 menit   1 menit  30 detik  2 menit
```

**Total: ~5 menit dari bug ke fix live**

### Scenario B: New Feature (30 menit - 2 jam)

```
Planning → Coding → Testing → Review → Push → Live
   ↓         ↓         ↓         ↓       ↓      ↓
10 menit  1 jam    20 menit  10 menit  30 detik  2 menit
```

**Total: ~2 jam dari ide ke feature live**

### Scenario C: Daily Updates (Multiple)

```
Morning:
├─ Pull latest changes (git pull)
├─ Start coding
└─ ...

Afternoon:
├─ Finish feature A
├─ Test & Push (update-code.bat)
├─ Continue coding feature B
└─ ...

Evening:
├─ Finish feature B
├─ Test & Push (update-code.bat)
└─ Done for the day
```

---

## 🔀 Git Flow Visualization

### Simple Flow (Solo Developer)

```
main branch:
    │
    ├─ commit 1: "Initial commit"
    │
    ├─ commit 2: "Add login feature"
    │
    ├─ commit 3: "Fix login bug"
    │
    ├─ commit 4: "Update styling"
    │
    └─ commit 5: "Add filter feature"
```

### Branch Flow (Team)

```
main branch:
    │
    ├─ commit 1: "Initial commit"
    │
    ├─────────────┐
    │             │ feature/payment branch
    │             ├─ "Add payment API"
    │             ├─ "Add payment UI"
    │             └─ "Test payment"
    │             │
    ├─────────────┘ (merge via Pull Request)
    │
    ├─ commit 2: "Merge payment feature"
    │
    └─ ...
```

---

## 📱 Multi-Device Workflow

### Komputer A (Kantor)

```
Morning:
├─ git pull (download latest)
├─ Coding...
└─ git push (upload changes)
```

### Komputer B (Rumah)

```
Evening:
├─ git pull (download dari kantor)
├─ Coding...
└─ git push (upload changes)
```

### Komputer A (Besok)

```
Morning:
├─ git pull (download dari rumah)
├─ Coding...
└─ git push (upload changes)
```

**Sync otomatis via GitHub!**

---

## 🚦 Status Indicators

### Git Status Colors

```
🟢 Green (Untracked)    → File baru, belum di-add
🟡 Yellow (Modified)    → File diubah, belum di-commit
🔴 Red (Deleted)        → File dihapus
⚪ White (Committed)    → File sudah di-commit
```

### Vercel Deploy Status

```
🟡 Building...          → Sedang build
🟢 Ready               → Deploy sukses
🔴 Failed              → Deploy gagal
⚪ Queued              → Antri deploy
```

---

## 📊 Timeline Comparison

### Manual Workflow (Tanpa Git)

```
Edit → Save → Upload via FTP → Wait → Test → Repeat
  ↓      ↓         ↓              ↓      ↓      ↓
1 min  instant   5-10 min      2 min  5 min  ...

Total per update: ~15-20 menit
Risk: High (manual upload, bisa salah file)
```

### Git + Vercel Workflow

```
Edit → Save → Push → Auto-Deploy → Live
  ↓      ↓      ↓         ↓          ↓
1 min  instant  30 sec   1-2 min   instant

Total per update: ~2-3 menit
Risk: Low (otomatis, tracked, bisa rollback)
```

**Hemat waktu: 80-85%!**

---

## 🎯 Best Practices Workflow

### ✅ Recommended

```
┌─────────────────────────────────────┐
│  1. Pull (jika tim)                 │
│  2. Create branch (jika fitur besar)│
│  3. Code & test                     │
│  4. Commit dengan pesan jelas       │
│  5. Push                            │
│  6. Verify di production            │
└─────────────────────────────────────┘
```

### ❌ Not Recommended

```
┌─────────────────────────────────────┐
│  1. Code tanpa test                 │
│  2. Commit semua sekaligus          │
│  3. Pesan commit tidak jelas        │
│  4. Push tanpa verify               │
│  5. Lupa pull (jika tim)            │
└─────────────────────────────────────┘
```

---

## 🔄 Rollback Workflow

Jika deploy bermasalah:

```
┌──────────────┐
│ Deploy Gagal │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Cek Error    │ → Lihat Vercel logs
└──────┬───────┘
       │
       ├─ Error di code? → Fix & push ulang
       │
       └─ Error di config? → Update config & push
       
       ▼
┌──────────────┐
│ Atau Rollback│ → Vercel: Rollback to previous
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Website OK   │
└──────────────┘
```

---

## 📈 Productivity Tips

### Commit Frequency

```
❌ Bad:  1 commit per week (terlalu jarang)
⚠️  OK:   1 commit per day
✅ Good: 3-5 commits per day
⭐ Best: Commit setiap fitur/fix selesai
```

### Commit Size

```
❌ Bad:  1000+ lines changed (terlalu besar)
⚠️  OK:   100-500 lines changed
✅ Good: 50-100 lines changed
⭐ Best: 10-50 lines changed (atomic commits)
```

---

## 🎓 Learning Path

### Week 1: Basic
```
✓ Understand git add, commit, push
✓ Use update-code.bat
✓ Check Vercel dashboard
```

### Week 2: Intermediate
```
✓ Write good commit messages
✓ Use git status, git log
✓ Understand git pull
```

### Week 3: Advanced
```
✓ Use branches
✓ Resolve merge conflicts
✓ Use git stash
```

### Week 4: Expert
```
✓ Create Pull Requests
✓ Code review workflow
✓ CI/CD understanding
```

---

## 🎯 Quick Commands Reference

```bash
# Daily workflow
git pull              # Start of day
git add .             # After coding
git commit -m "msg"   # Save changes
git push              # End of session

# Check status
git status            # What changed?
git log --oneline     # History
git diff              # Detailed changes

# Undo/Fix
git reset --soft HEAD~1   # Undo last commit
git stash                 # Save work temporarily
git stash pop             # Restore saved work
```

---

**Simpan workflow ini untuk referensi! 📌**

*Happy Coding & Deploying! 🚀*
