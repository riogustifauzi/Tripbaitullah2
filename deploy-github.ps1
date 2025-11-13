# Deploy Tripbaitullah ke GitHub
# PowerShell Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploy Tripbaitullah ke GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cek apakah git sudah terinstall
try {
    $gitVersion = git --version
    Write-Host "[OK] Git terinstall: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Git belum terinstall!" -ForegroundColor Red
    Write-Host "Silakan download dari: https://git-scm.com/downloads" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[1/5] Cek status Git..." -ForegroundColor Yellow

# Cek apakah sudah ada git repository
$isGitRepo = Test-Path ".git"
if (-not $isGitRepo) {
    Write-Host "[INFO] Belum ada Git repository, membuat repository baru..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Git repository berhasil dibuat!" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Gagal membuat Git repository!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "[OK] Git repository sudah ada" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/5] Menambahkan semua file..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Semua file berhasil ditambahkan" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Gagal menambahkan file!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
$commitMsg = Read-Host "[3/5] Masukkan pesan commit (Enter untuk 'Update code')"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "Update code"
}

git commit -m "$commitMsg"
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARNING] Tidak ada perubahan untuk di-commit atau commit gagal" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[4/5] Cek remote repository..." -ForegroundColor Yellow

# Cek apakah sudah ada remote origin
$remoteExists = git remote | Select-String -Pattern "origin" -Quiet
if (-not $remoteExists) {
    Write-Host "[INFO] Belum ada remote repository" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Silakan buat repository di GitHub terlebih dahulu:" -ForegroundColor Cyan
    Write-Host "1. Buka https://github.com/new" -ForegroundColor White
    Write-Host "2. Buat repository baru (private atau public)" -ForegroundColor White
    Write-Host "3. JANGAN centang 'Initialize with README'" -ForegroundColor White
    Write-Host ""
    
    $repoUrl = Read-Host "Masukkan URL repository (contoh: https://github.com/username/tripbaitullah.git)"
    
    if ([string]::IsNullOrWhiteSpace($repoUrl)) {
        Write-Host "[ERROR] URL repository tidak boleh kosong!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    git remote add origin $repoUrl
    git branch -M main
    Write-Host "[OK] Remote repository berhasil ditambahkan" -ForegroundColor Green
} else {
    Write-Host "[OK] Remote repository sudah ada" -ForegroundColor Green
}

Write-Host ""
Write-Host "[5/5] Push ke GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   Deploy Berhasil! ^_^" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Website Anda sudah tersimpan di GitHub!" -ForegroundColor Cyan
    Write-Host "Buka repository Anda di browser untuk melihatnya." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "[ERROR] Push gagal!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Kemungkinan penyebab:" -ForegroundColor Yellow
    Write-Host "- Kredensial salah (gunakan Personal Access Token sebagai password)" -ForegroundColor White
    Write-Host "- Repository belum dibuat di GitHub" -ForegroundColor White
    Write-Host "- Tidak ada koneksi internet" -ForegroundColor White
    Write-Host ""
    Write-Host "Cara membuat Personal Access Token:" -ForegroundColor Cyan
    Write-Host "1. Buka https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "2. Generate new token (classic)" -ForegroundColor White
    Write-Host "3. Pilih scope: repo" -ForegroundColor White
    Write-Host "4. Copy token dan gunakan sebagai password" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to exit"
