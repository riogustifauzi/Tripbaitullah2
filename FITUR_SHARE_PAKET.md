# Fitur Share Paket Umroh

## Deskripsi
Fitur share ke sosial media telah ditambahkan pada halaman detail paket umroh (`src/app/paket/[id]/page.tsx`).

## Fitur yang Ditambahkan

### 1. **Tombol Share**
- Tombol share dengan icon Share2 di bagian header paket (sebelah judul)
- Warna biru dengan border dan hover effect
- Membuka dialog share saat diklik

### 2. **Dialog Share Lengkap**
Modal dialog yang menampilkan:

#### Preview Paket:
- **Gambar paket** (thumbnail 20x20)
- **Judul paket** (dengan line-clamp-2)
- **Nama travel provider** dengan emoji 🏢
- **Harga paket** yang dipilih (sesuai tier yang aktif)
- **Tanggal keberangkatan** dengan icon Calendar
- **Durasi perjalanan** dengan icon Clock

#### Opsi Share ke Platform:
1. **WhatsApp** - Icon hijau dengan hover effect
2. **Facebook** - Icon biru dengan hover effect
3. **Twitter** - Icon sky blue dengan hover effect
4. **LinkedIn** - Icon biru tua dengan hover effect

#### Fitur Copy Link:
- Input field dengan URL paket (read-only)
- Tombol "Salin" yang berubah menjadi "Tersalin!" dengan icon CheckCircle
- Auto-select text saat input diklik
- Feedback visual selama 2 detik

### 3. **Konten yang Dibagikan**

Format pesan yang dibagikan mencakup:

```
🕋 *[Judul Paket]*

🏢 Travel: [Nama Travel]
📅 Keberangkatan: [Tanggal Lengkap]
⏰ Durasi: [X] Hari
✈️ Penerbangan: [Maskapai] ([Jenis Penerbangan])
💰 Harga: [Harga Formatted] ([Nama Tier])

✨ Fasilitas Unggulan:
• [Fasilitas 1]
• [Fasilitas 2]
• [Fasilitas 3]

🏨 Hotel:
• Makkah: [Nama Hotel Makkah]
• Madinah: [Nama Hotel Madinah]

Daftar sekarang! 👇
[Link Paket]
```

### 4. **Implementasi Teknis**

#### State Management:
```typescript
const [showShareDialog, setShowShareDialog] = useState(false)
const [copySuccess, setCopySuccess] = useState(false)
```

#### Fungsi Utama:
- `getShareText()` - Generate text share dengan informasi lengkap
- `handleShare(platform)` - Handle share ke berbagai platform
- `copyToClipboard()` - Copy text dan link ke clipboard

#### Platform Share URLs:
- **WhatsApp**: `https://wa.me/?text=[text]%0A%0A[url]`
- **Facebook**: `https://www.facebook.com/sharer/sharer.php?u=[url]&quote=[text]`
- **Twitter**: `https://twitter.com/intent/tweet?text=[text]&url=[url]`
- **LinkedIn**: `https://www.linkedin.com/sharing/share-offsite/?url=[url]`

### 5. **UI/UX Features**

- **Responsive Design**: Dialog menyesuaikan dengan ukuran layar (sm:max-w-md)
- **Gradient Background**: Preview paket dengan gradient emerald-green
- **Hover Effects**: Setiap tombol platform memiliki hover effect sesuai brand color
- **Auto Close**: Dialog otomatis tertutup setelah share
- **Visual Feedback**: Tombol copy menampilkan feedback "Tersalin!" selama 2 detik
- **Accessibility**: Input dapat di-select dengan klik untuk memudahkan copy manual

### 6. **Informasi Dinamis**

Semua informasi yang dibagikan bersifat dinamis berdasarkan:
- Paket yang sedang dilihat
- Tier harga yang dipilih user
- Travel provider terkait
- Data real-time dari database

## Cara Penggunaan

1. User membuka halaman detail paket umroh
2. User memilih tier harga yang diinginkan
3. User klik tombol share (icon Share2) di header paket
4. Dialog share muncul dengan preview paket
5. User memilih platform untuk share atau copy link
6. Informasi lengkap paket otomatis dibagikan

## Dependencies

- `lucide-react`: Icons (Share2, MessageCircle, Facebook, Twitter, Linkedin, Copy, CheckCircle, Calendar, Clock)
- `@/components/ui/dialog`: Dialog component
- `@/components/ui/button`: Button component
- `@/components/ui/separator`: Separator component

## File yang Dimodifikasi

- `src/app/paket/[id]/page.tsx` - Halaman detail paket umroh

## Status

✅ Implementasi selesai
✅ Tidak ada error diagnostik
✅ Semua fitur berfungsi dengan baik
