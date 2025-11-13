@echo off
echo ========================================
echo   Deploy Tripbaitullah ke GitHub
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

echo [1/5] Cek status Git...
git status >nul 2>&1
if errorlevel 1 (
    echo [INFO] Belum ada Git repository, membuat repository baru...
    git init
    echo [OK] Git repository berhasil dibuat!
) else (
    echo [OK] Git repository sudah ada
)

echo.
echo [2/5] Menambahkan semua file...
git add .
if errorlevel 1 (
    echo [ERROR] Gagal menambahkan file!
    pause
    exit /b 1
)
echo [OK] Semua file berhasil ditambahkan

echo.
set /p commit_msg="[3/5] Masukkan pesan commit: "
if "%commit_msg%"=="" set commit_msg=Update code

git commit -m "%commit_msg%"
if errorlevel 1 (
    echo [WARNING] Tidak ada perubahan untuk di-commit atau commit gagal
)

echo.
echo [4/5] Cek remote repository...
git remote -v | findstr origin >nul 2>&1
if errorlevel 1 (
    echo [INFO] Belum ada remote repository
    echo.
    echo Silakan buat repository di GitHub terlebih dahulu:
    echo 1. Buka https://github.com/new
    echo 2. Buat repository baru (private atau public)
    echo 3. JANGAN centang "Initialize with README"
    echo.
    set /p repo_url="Masukkan URL repository (contoh: https://github.com/username/tripbaitullah.git): "
    
    if "!repo_url!"=="" (
        echo [ERROR] URL repository tidak boleh kosong!
        pause
        exit /b 1
    )
    
    git remote add origin !repo_url!
    git branch -M main
    echo [OK] Remote repository berhasil ditambahkan
) else (
    echo [OK] Remote repository sudah ada
)

echo.
echo [5/5] Push ke GitHub...
git push -u origin main
if errorlevel 1 (
    echo.
    echo [ERROR] Push gagal!
    echo.
    echo Kemungkinan penyebab:
    echo - Kredensial salah (gunakan Personal Access Token sebagai password)
    echo - Repository belum dibuat di GitHub
    echo - Tidak ada koneksi internet
    echo.
    echo Cara membuat Personal Access Token:
    echo 1. Buka https://github.com/settings/tokens
    echo 2. Generate new token (classic)
    echo 3. Pilih scope: repo
    echo 4. Copy token dan gunakan sebagai password
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Deploy Berhasil! ^_^
echo ========================================
echo.
echo Website Anda sudah tersimpan di GitHub!
echo Buka repository Anda di browser untuk melihatnya.
echo.
pause
