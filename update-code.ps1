# Update Code ke GitHub & Vercel
# PowerShell Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Update Code ke GitHub & Vercel" -ForegroundColor Cyan
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
Write-Host "[1/5] Cek file yang berubah..." -ForegroundColor Yellow
Write-Host ""

# Tampilkan file yang berubah
git status --short

Write-Host ""
$confirm = Read-Host "Lanjutkan update? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Update dibatalkan." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 0
}

Write-Host ""
Write-Host "[2/5] Menambahkan semua perubahan..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Semua perubahan berhasil ditambahkan" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Gagal menambahkan file!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Contoh pesan commit yang baik:" -ForegroundColor Cyan
Write-Host "- 'Fix: Perbaikan bug pada form login'" -ForegroundColor White
Write-Host "- 'Feature: Tambah filter harga paket'" -ForegroundColor White
Write-Host "- 'Update: Styling halaman homepage'" -ForegroundColor White
Write-Host "- 'Refactor: Optimasi kode admin panel'" -ForegroundColor White
Write-Host ""

$commitMsg = Read-Host "[3/5] Masukkan pesan commit"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    Write-Host "[ERROR] Pesan commit tidak boleh kosong!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

git commit -m "$commitMsg"
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Commit berhasil" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Tidak ada perubahan untuk di-commit" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 0
}

Write-Host ""
Write-Host "[4/5] Upload ke GitHub..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Upload ke GitHub berhasil!" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "[5/5] Vercel Auto-Deploy..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Vercel sedang men-deploy perubahan Anda..." -ForegroundColor Cyan
    Write-Host "Proses biasanya selesai dalam 1-2 menit." -ForegroundColor White
    Write-Host ""
    Write-Host "Cek status deploy di:" -ForegroundColor Cyan
    Write-Host "https://vercel.com/dashboard" -ForegroundColor White
    Write-Host ""
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   Update Berhasil! ^_^" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Perubahan Anda sudah di-upload ke GitHub." -ForegroundColor Cyan
    Write-Host "Vercel akan otomatis deploy dalam beberapa menit." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Website akan segera update di:" -ForegroundColor Cyan
    Write-Host "https://tripbaitullah2.vercel.app" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "[ERROR] Push gagal!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Kemungkinan penyebab:" -ForegroundColor Yellow
    Write-Host "- Tidak ada koneksi internet" -ForegroundColor White
    Write-Host "- Kredensial salah" -ForegroundColor White
    Write-Host "- Ada conflict dengan remote" -ForegroundColor White
    Write-Host ""
    Write-Host "Coba jalankan: git pull" -ForegroundColor Cyan
    Write-Host "Lalu jalankan script ini lagi" -ForegroundColor Cyan
}

Write-Host ""
Read-Host "Press Enter to exit"
