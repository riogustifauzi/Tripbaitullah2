# Update Card Style - Landing Page

## Perubahan yang Dilakukan

### Tujuan
Mengubah style card paket umroh di landing page agar konsisten dengan card di halaman `/paket`.

### Perubahan Detail

#### 1. Card Container
**Sebelum:**
```tsx
<Card key={pkg.id} className="bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
```

**Sesudah:**
```tsx
<Card 
  key={pkg.id} 
  className="bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
  onClick={() => window.location.href = `/paket/${pkg.id}`}
>
```

**Perubahan:**
- ✅ Menambahkan `cursor-pointer` untuk menunjukkan card bisa diklik
- ✅ Menambahkan `onClick` handler untuk navigasi ke detail paket
- ✅ Seluruh card sekarang clickable, bukan hanya tombol

#### 2. Card Header (Image Section)
**Sebelum:**
```tsx
<CardHeader className="relative">
  <img className="w-full h-32 object-cover rounded-lg" />
</CardHeader>
```

**Sesudah:**
```tsx
<CardHeader className="relative p-0">
  <img className="w-full h-40 object-cover rounded-t-lg" />
</CardHeader>
```

**Perubahan:**
- ✅ Menambahkan `p-0` untuk menghilangkan padding default
- ✅ Mengubah tinggi gambar dari `h-32` (8rem) ke `h-40` (10rem)
- ✅ Mengubah `rounded-lg` ke `rounded-t-lg` (hanya rounded di atas)

#### 3. Grid Layout
**Sebelum:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
```

**Sesudah:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
```

**Perubahan:**
- ✅ Mengubah gap dari `gap-4` (1rem) ke `gap-6` (1.5rem) untuk spacing yang lebih baik

#### 4. Card Title
**Sebelum:**
```tsx
<CardTitle className="text-base mb-2">{pkg.title}</CardTitle>
```

**Sesudah:**
```tsx
<CardTitle className="text-base mb-2 line-clamp-2">{pkg.title}</CardTitle>
```

**Perubahan:**
- ✅ Menambahkan `line-clamp-2` untuk membatasi judul maksimal 2 baris

#### 5. Rating Section (BARU)
**Ditambahkan:**
```tsx
<div className="flex items-center space-x-1 mb-3">
  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
  <span className="text-sm font-semibold">{pkg.rating}</span>
  <span className="text-sm text-gray-500">({pkg.reviews})</span>
</div>
```

**Perubahan:**
- ✅ Menambahkan section rating dengan bintang kuning
- ✅ Menampilkan rating numerik dan jumlah ulasan
- ✅ Konsisten dengan halaman `/paket`

#### 6. Travel Information
**Sebelum:**
```tsx
<div className="grid grid-cols-1 gap-2 mb-3">
  <div className="flex items-center space-x-2 text-sm text-gray-600">
    <Calendar className="w-4 h-4 text-emerald-600" />
    <span className="font-medium">Keberangkatan:</span>
    <span>{pkg.departureDate}</span>
  </div>
  <!-- Similar for other fields -->
</div>
```

**Sesudah:**
```tsx
<div className="space-y-2 mb-3">
  <div className="flex items-center space-x-2 text-xs text-gray-600">
    <Calendar className="w-3 h-3 text-emerald-600" />
    <span>{pkg.departureDate}</span>
  </div>
  <!-- Similar for other fields -->
</div>
```

**Perubahan:**
- ✅ Mengubah dari `grid` ke `space-y-2` untuk layout vertikal
- ✅ Mengurangi ukuran text dari `text-sm` ke `text-xs`
- ✅ Mengurangi ukuran icon dari `w-4 h-4` ke `w-3 h-3`
- ✅ Menghilangkan label "Keberangkatan:", "Kota:", "Durasi:" untuk tampilan lebih compact

#### 7. Separator
**Sebelum:**
```tsx
<Separator className="my-4" />
```

**Sesudah:**
```tsx
<Separator className="my-3" />
```

**Perubahan:**
- ✅ Mengurangi margin dari `my-4` ke `my-3` untuk spacing yang lebih compact

#### 8. Price Section
**Sebelum:**
```tsx
<div className="space-y-3">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-2xl font-bold text-emerald-600">{pkg.price}</p>
      <p className="text-sm text-gray-500 line-through">{pkg.originalPrice}</p>
    </div>
    <Badge className="bg-red-500 text-white text-xs">
      Cashback {pkg.cashback}
    </Badge>
  </div>
</div>
```

**Sesudah:**
```tsx
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xl font-bold text-emerald-600">{pkg.price}</p>
      <p className="text-xs text-gray-500 line-through">{pkg.originalPrice}</p>
    </div>
    <Badge className="bg-red-500 text-white text-xs">
      Cashback
    </Badge>
  </div>
</div>
```

**Perubahan:**
- ✅ Mengubah spacing dari `space-y-3` ke `space-y-2`
- ✅ Mengurangi ukuran harga dari `text-2xl` ke `text-xl`
- ✅ Mengurangi ukuran original price dari `text-sm` ke `text-xs`
- ✅ Menyederhanakan badge cashback (hanya text "Cashback" tanpa nominal)

#### 9. Button
**Sebelum:**
```tsx
<Button 
  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
  onClick={() => window.location.href = `/paket/${pkg.id}`}
>
  Lihat Detail Paket
</Button>
```

**Sesudah:**
```tsx
<Button 
  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
  onClick={(e) => {
    e.stopPropagation()
    window.location.href = `/paket/${pkg.id}`
  }}
>
  Lihat Detail
</Button>
```

**Perubahan:**
- ✅ Menambahkan `e.stopPropagation()` untuk mencegah double navigation
- ✅ Mengubah text dari "Lihat Detail Paket" ke "Lihat Detail" (lebih singkat)

#### 10. Import Statement
**Ditambahkan:**
```tsx
import { ..., Star } from 'lucide-react'
```

**Perubahan:**
- ✅ Menambahkan import `Star` icon untuk rating section

## Hasil Akhir

### Konsistensi yang Dicapai
- ✅ Layout dan spacing yang sama
- ✅ Ukuran font yang konsisten
- ✅ Ukuran icon yang sama
- ✅ Rating section dengan bintang
- ✅ Hover effect yang sama
- ✅ Click behavior yang konsisten
- ✅ Badge styling yang sama
- ✅ Button text yang lebih singkat

### Visual Improvements
- ✅ Card lebih compact dan rapi
- ✅ Informasi lebih mudah dibaca
- ✅ Rating langsung terlihat
- ✅ Gambar lebih besar (h-40 vs h-32)
- ✅ Spacing lebih proporsional

### User Experience
- ✅ Seluruh card clickable (tidak hanya button)
- ✅ Cursor pointer menunjukkan interaktivitas
- ✅ Smooth hover animation
- ✅ Consistent navigation behavior

## Testing
- ✅ Landing page: `http://localhost:3000` - Status 200
- ✅ No diagnostics errors
- ✅ Server running successfully
- ✅ All cards render correctly
- ✅ Click navigation works properly

## Files Modified
- `src/app/page.tsx` - Updated package cards styling

## Compatibility
- ✅ Responsive design maintained
- ✅ Mobile layout works correctly
- ✅ Desktop layout optimized
- ✅ All existing functionality preserved
