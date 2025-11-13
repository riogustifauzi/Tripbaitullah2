# Tripbaitullah - Platform Umroh Terpercaya

Platform website untuk menemukan paket umroh terbaik dari travel umroh berpengalaman di Indonesia.

## 🚀 Fitur Utama

### User Features
- **Paket Umroh**: Browse dan cari paket umroh dengan filter harga, durasi, dan bulan keberangkatan
- **Travel Umroh**: Daftar travel umroh terpercaya dengan rating dan review
- **Blog & Artikel**: Tips, panduan, dan informasi seputar umroh
- **Hero Slider**: Banner promosi dinamis di homepage
- **Responsive Design**: Tampilan optimal di semua device

### Admin Panel (`/paneladmin`)
- **Dashboard**: Overview statistik dan data
- **Manajemen Travel**: CRUD travel umroh
- **Manajemen Paket**: CRUD paket umroh dengan pricing tiers
- **Manajemen Blog**: Rich text editor untuk artikel
- **Hero Slides**: Kelola banner homepage
- **User Management**: Kelola akun admin/editor
- **Settings**: Konfigurasi website (logo, kontak, dll)
- **Authentication**: Login system dengan role-based access

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Data Storage**: JSON files (untuk demo)
- **Image Upload**: Local storage

## 📦 Installation

1. Clone repository:
```bash
git clone <repository-url>
cd tripbaitullah
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Open browser:
```
http://localhost:3000
```

## 🔐 Admin Access

Default admin credentials:
- Username: `admin`
- Password: `admin123`

Access admin panel at: `http://localhost:3000/paneladmin/login`

## 📁 Project Structure

```
tripbaitullah/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── paneladmin/        # Admin panel pages
│   │   ├── api/               # API routes
│   │   ├── blog/              # Blog pages
│   │   ├── paket/             # Package pages
│   │   ├── travel/            # Travel pages
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── admin/            # Admin components
│   │   └── ui/               # UI components (shadcn)
│   ├── lib/                   # Utilities
│   ├── types/                 # TypeScript types
│   ├── data/                  # JSON data files
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
└── package.json
```

## 🎨 Features Detail

### Package Management
- Multiple pricing tiers per package
- Cashback system
- Pin/unpin packages
- Image gallery
- Facilities and itinerary

### Blog System
- Rich text editor with formatting
- Featured images
- Categories and tags
- Comments system
- Related articles
- SEO meta tags

### Travel Management
- Logo upload
- Rating system
- Contact information
- Active/inactive status

## 🚀 Deployment

### Deploy Pertama Kali ke GitHub

**Cara Cepat (Windows):**
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

📚 **Panduan Deploy Pertama:**
- **Quick Start**: Baca `QUICK_DEPLOY.md`
- **Panduan Detail**: Baca `PANDUAN_DEPLOY_GITHUB.md`
- **Checklist**: Baca `CHECKLIST_DEPLOY.md`
- **Daftar Panduan**: Baca `README_DEPLOY.md`

### Update Code (Setelah Ada Perubahan)

**Cara Tercepat:**
```bash
update-code.bat
```

**Atau Manual:**
```bash
git add .
git commit -m "Deskripsi perubahan"
git push
```

📚 **Panduan Update Code:**
- **Panduan Lengkap**: Baca `PANDUAN_UPDATE_CODE.md`
- **Quick Reference**: Baca `QUICK_UPDATE.md`

### Deploy ke Vercel (Recommended untuk Production)

Vercel akan otomatis deploy setiap kali Anda push ke GitHub.
Cek status di: https://vercel.com/dashboard

### Deploy ke Platform Lain
```bash
npm run build
npm start
```

## 📝 Environment Variables

Create `.env.local` file:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn for the beautiful UI components
- All contributors who helped build this project
