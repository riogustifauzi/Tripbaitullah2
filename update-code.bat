@echo off
echo ========================================
echo   Update Code ke GitHub ^& Vercel
echo ========================================
echo.

REM Cek apakah git sudah terinstall
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git belum terinstall!
    echo Silakan download dari: https://git-scm.com/downloads
    pause
    exit /b 1
)

echo [1/5] Cek file yang berubah...
echo.
git status --short
echo.

set /p confirm="Lanjutkan update? (Y/N): "
if /i not "%confirm%"=="Y" (
    echo Update dibatalkan.
    pause
    exit /b 0
)

echo.
echo [2/5] Menambahkan semua perubahan...
git add .
if errorlevel 1 (
    echo [ERROR] Gagal menambahkan file!
    pause
    exit /b 1
)
echo [OK] Semua perubahan berhasil ditambahkan

echo.
echo Contoh pesan commit yang baik:
echo - "Fix: Perbaikan bug pada form login"
echo - "Feature: Tambah filter harga paket"
echo - "Update: Styling halaman homepage"
echo - "Refactor: Optimasi kode admin panel"
echo.
set /p commit_msg="[3/5] Masukkan pesan commit: "
if "%commit_msg%"=="" (
    echo [ERROR] Pesan commit tidak boleh kosong!
    pause
    exit /b 1
)

git commit -m "%commit_msg%"
if errorlevel 1 (
    echo [WARNING] Tidak ada perubahan untuk di-commit
    pause
    exit /b 0
)
echo [OK] Commit berhasil

echo.
echo [4/5] Upload ke GitHub...
git push
if errorlevel 1 (
    echo.
    echo [ERROR] Push gagal!
    echo.
    echo Kemungkinan penyebab:
    echo - Tidak ada koneksi internet
    echo - Kredensial salah
    echo - Ada conflict dengan remote
    echo.
    echo Coba jalankan: git pull
    echo Lalu jalankan script ini lagi
    echo.
    pause
    exit /b 1
)

echo [OK] Upload ke GitHub berhasil!

echo.
echo [5/5] Vercel Auto-Deploy...
echo.
echo Vercel sedang men-deploy perubahan Anda...
echo Proses biasanya selesai dalam 1-2 menit.
echo.
echo Cek status deploy di:
echo https://vercel.com/dashboard
echo.

echo ========================================
echo   Update Berhasil! ^_^
echo ========================================
echo.
echo Perubahan Anda sudah di-upload ke GitHub.
echo Vercel akan otomatis deploy dalam beberapa menit.
echo.
echo Website akan segera update di:
echo https://tripbaitullah2.vercel.app
echo.
pause
