<div align="center">
  <img src="./public/logo-hutri-81.png" alt="Logo HUT RI ke-81 RW 10" height="90" onerror="this.style.display='none'" />
  <h1>🇮🇩 PORTAL SEMARAK 17-AN RW 10 🇮🇩</h1>
  <p><strong>Platform Pendaftaran Lomba, E-Ticket QR Code, Check-In Digital & Galeri Dokumentasi HUT RI Ke-81</strong></p>
  
  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js_16-App_Router-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React_19-Modern_Hooks-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript_5-Strict_Types-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS_v4-Modern_Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://orm.drizzle.team/"><img src="https://img.shields.io/badge/Drizzle_ORM-Neon_Postgres-C5F74F?style=for-the-badge&logo=postgresql&logoColor=black" alt="Drizzle ORM" /></a>
    <a href="https://www.better-auth.com/"><img src="https://img.shields.io/badge/Better_Auth-RBAC_Secured-EE2B2B?style=for-the-badge&logo=shield&logoColor=white" alt="Better Auth" /></a>
  </p>
</div>

---

## 📖 Tentang Aplikasi

**Portal Semarak 17-an RW 10** adalah platform web modern yang dibangun untuk mendigitalisasi dan mempermudah perayaan tahunan Hari Ulang Tahun Kemerdekaan Republik Indonesia (HUT RI) ke-81 di lingkungan RW 10.

Aplikasi ini hadir untuk menyelesaikan tantangan operasional klasik kepanitiaan warga:
1. **Pendaftaran Manual yang Berceceran**: Mengganti formulir kertas atau pesan chat dengan sistem pendaftaran terpusat berkuota otomatis.
2. **Ketiadaan Bukti Sah Kehadiran**: Setiap peserta mendapatkan **E-Ticket Digital ber-QR Code unik** yang dapat disimpan langsung ke galeri HP.
3. **Antrean Registrasi Ulang di Hari-H**: Panitia dapat melakukan verifikasi kehadiran peserta via pemindai kamera QR Code hanya dalam 1 detik.
4. **Dokumentasi Tercecer**: Galeri foto terorganisir per lomba dengan kompresi foto otomatis di sisi peramban sebelum dikirim ke cloud.

---

## ✨ Fitur Utama

### 👥 1. Portal Publik & Warga
* **Pendaftaran Instan & Zero-Friction**: Warga dapat mendaftar lomba individu maupun beregu/tim tanpa harus membuat akun atau mengingat kata sandi.
* **E-Ticket Digital & Unduh Gambar**: Halaman bukti pendaftaran resmi (`/bukti/[publicCode]`) dilengkapi kode QR unik serta tombol unduh tiket dalam format gambar (.png) menggunakan `html2canvas`.
* **Pencegahan Registrasi Ganda & Kuota Dinamis**: Pengecekan sisa kuota lomba secara real-time dan validasi data peserta berbasis Zod schema.
* **Galeri Dokumentasi Momen**:
  * Tampilan foto responsif dengan filter dinamis kategori lomba.
  * Tinjau gambar ukuran penuh (Interactive Lightbox).
  * Fitur unduh foto langsung ke perangkat bebas hambatan CORS melalui Server-Side API Proxy Next.js.
* **Jadwal Interaktif 3 Hari**: Navigasi agenda perayaan kemerdekaan yang informatif dan terstruktur.
* **Countdown Interaktif**: Hitung mundur otomatis menuju puncak perayaan 17 Agustus.
* **Dukungan Dark / Light Mode & PWA-Ready**: Tampilan nyaman di malam hari serta dapat dipasang di layar utama ponsel selayaknya aplikasi native.

### 🛡️ 2. Portal Manajemen Panitia & Administrator
* **Role-Based Access Control (RBAC)**: Otentikasi aman berbasis sesi dengan pemisahan peran `ADMIN` dan `PANITIA` ditenagai oleh **Better Auth**.
* **Dasbor Statistik & Ringkasan Lomba**: Pemantauan jumlah pendaftar, kuota tersisa, dan status check-in peserta secara visual.
* **Check-In Kilat QR Code**: Pemindai kamera QR Code terintegrasi untuk verifikasi kehadiran peserta di lokasi lomba secara cepat dan akurat.
* **Manajemen Pendaftar & Ekspor Data**: Filter pendaftar berdasarkan lomba dan status kehadiran, serta ekspor data ke format CSV / spreadsheet untuk kebutuhan absensi fisik.
* **Manajemen Lomba & Kategori Usia**: Tambah, ubah, dan kelola data lomba, deskripsi, lokasi, waktu pelaksanaan, serta batas kuota.
* **Manajemen Galeri dengan Mesin Kompresi Cerdas**:
  * *Smart Size Safeguard*: Foto di bawah 300 KB diunggah langsung tanpa penurunan mutu.
  * *Adaptive Canvas Downscaling*: Foto kamera resolusi tinggi (>5 MB) dikompresi otomatis secara adaptif di browser hingga berukuran ideal (<300 KB) sebelum diunggah ke Supabase Storage.
* **Manajemen Pengguna (User Management)**: Admin dapat menambahkan akun panitia baru dan mengelola hak akses.
* **Inisialisasi Admin Aman (`/setup`)**: Skema registrasi admin pertama yang dilengkapi proteksi *self-locking* otomatis setelah admin terdaftar.

---

## 🛠️ Tech Stack & Arsitektur

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | Server Components, Server Actions, & API Routes |
| **Frontend UI** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/) | Styling modern, responsif, & performa tinggi |
| **Komponen UI** | [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) | Primitif UI aksesibel dan koleksi ikon modern |
| **Bahasa & Validasi** | [TypeScript](https://www.typescriptlang.org/) & [Zod](https://zod.dev/) | Type safety penuh dan validasi skema form/API |
| **Basis Data & ORM** | [Drizzle ORM](https://orm.drizzle.team/) + [Neon PostgreSQL](https://neon.tech/) | Serverless database PostgreSQL performa kilat |
| **Otentikasi** | [Better Auth](https://www.better-auth.com/) | Manajemen sesi cookie terenkripsi & RBAC |
| **Media Storage** | [Supabase Storage](https://supabase.com/storage) | Penyimpanan berkas foto galeri dokumentasi |
| **Fitur Tiket & QR** | `qrcode`, `html2canvas` | Pembuatan QR Code dinamis dan konversi tiket ke gambar |

---

## 📂 Struktur Direktori Proyek

```
pendaftaran-lomba/
├── public/                     # Aset statis (logo, favicon, gambar)
├── src/
│   ├── actions/                # Next.js Server Actions (registrasi, check-in, dll.)
│   ├── app/
│   │   ├── (public)/           # Halaman publik (Beranda, Daftar, Galeri, Bukti)
│   │   ├── api/                # API Routes (Auth handler, Image download proxy)
│   │   ├── portal/             # Dasbor panitia & admin (Terproteksi RBAC)
│   │   ├── setup/              # Wizard registrasi awal admin (Self-locking)
│   │   ├── globals.css         # Styling global Tailwind CSS
│   │   └── layout.tsx          # Root layout aplikasi & provider tema
│   ├── components/
│   │   ├── site/               # Komponen spesifik modul (Form, Galeri, Scanner, dll.)
│   │   └── ui/                 # Komponen antarmuka dasar (Button, Card, Dialog, dll.)
│   ├── db/
│   │   ├── schema.ts           # Definisi skema tabel Drizzle ORM
│   │   ├── index.ts            # Inisialisasi koneksi Neon Postgres
│   │   └── seed.ts             # Skrip pembenihan data awal lomba
│   └── lib/                    # Utilitas, konfigurasi auth, dan helper functions
├── .env.example                # Contoh template environment variables
├── package.json                # Daftar dependensi & npm scripts
└── README.md                   # Dokumentasi resmi proyek
```

---

## 🚀 Panduan Instalasi Lokal

### 1. Prasyarat
- **Node.js** versi `>= 18.x`
- Package manager **pnpm** (direkomendasikan), npm, atau bun

### 2. Kloning Repositori
```bash
git clone https://github.com/rayyanbabab/aplikasi-pendaftaran-lomba-rw.git
cd aplikasi-pendaftaran-lomba-rw
pnpm install
```

### 3. Konfigurasi Environment Variables
Buat salinan berkas `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Lalu lengkapi nilai variabel berikut:
```ini
# Koneksi Database Neon PostgreSQL
DATABASE_URL="postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Supabase Storage untuk Galeri Foto
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"

# Better Auth Secret & Base URL
BETTER_AUTH_SECRET="kunci-rahasia-acak-minimal-32-karakter"
BETTER_AUTH_URL="http://localhost:3000"
```

### 4. Sinkronisasi Database
Kirim definisi skema Drizzle ke basis data:
```bash
pnpm db:push
```

### 5. Seeding Data Awal (Opsional)
Untuk mengisi database dengan daftar lomba awal RW 10:
```bash
pnpm db:seed
```

### 6. Menjalankan Server Pengembangan
```bash
pnpm dev
```
Akses aplikasi melalui peramban di [http://localhost:3000](http://localhost:3000).

---

## 🔐 Setup Akun Administrator Pertama

1. Jalankan aplikasi secara lokal atau di server.
2. Buka halaman wizard inisialisasi:
   👉 **`http://localhost:3000/setup`**
3. Masukkan data nama pengelola, email admin, dan kata sandi.
4. Setelah admin berhasil dibuat, sistem secara otomatis mengunci rute `/setup` demi keamanan.
5. Anda dapat masuk ke portal admin melalui:
   👉 **`http://localhost:3000/portal/login`**

---

## 📜 Perintah Skrip Tersedia

| Perintah | Deskripsi |
| :--- | :--- |
| `pnpm dev` | Menjalankan server development Next.js |
| `pnpm build` | Melakukan kompilasi build produksi |
| `pnpm start` | Menjalankan aplikasi dalam mode produksi |
| `pnpm lint` | Menjalankan audit kode dengan ESLint |
| `pnpm db:push` | Sinkronisasi skema Drizzle langsung ke database |
| `pnpm db:generate` | Membuat berkas migrasi SQL baru |
| `pnpm db:migrate` | Menjalankan migrasi SQL ke database |
| `pnpm db:seed` | Menjalankan skrip seeding data lomba default |

---

## 🌐 Panduan Deploy ke Vercel

1. Hubungkan repositori **`rayyanbabab/aplikasi-pendaftaran-lomba-rw`** ke akun [Vercel](https://vercel.com/).
2. Pada menu **Environment Variables** di Vercel Settings, tambahkan seluruh variabel dari `.env.local`:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL` (isi dengan domain Vercel Anda, contoh: `https://lomba-rw10.vercel.app`)
3. Klik **Deploy**. Aplikasi siap mengudara dan melayani warga secara online! 🇮🇩✨

---

<div align="center">
  <p>Dikembangkan dengan bangga untuk menyemarakkan <strong>HUT Republik Indonesia Ke-81 RW 10</strong>. 🏆🇮🇩</p>
</div>
