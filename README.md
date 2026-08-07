<div align="center">
  <img src="./public/logo-hutri-81.png" alt="Logo HUT RI ke-81 RW 10" height="90" onerror="this.style.display='none'" />
  <h1>🇮🇩 PORTAL SEMARAK 17-AN RW 10 🇮🇩</h1>
  <p><strong>Platform Resmi Pendaftaran Perlombaan, Check-In Digital & Galeri Dokumentasi Momen HUT RI Ke-81</strong></p>
  
  <p>
    <a href="#fitur-unggulan"><img src="https://img.shields.io/badge/Next.js_15-App_Router-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="#stack-teknologi"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="#stack-teknologi"><img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="#stack-teknologi"><img src="https://img.shields.io/badge/Drizzle_ORM-Neon_PostgreSQL-C5F74F?style=for-the-badge&logo=postgresql&logoColor=black" alt="Drizzle ORM" /></a>
    <a href="#stack-teknologi"><img src="https://img.shields.io/badge/Better_Auth-Secure_RBAC-EE2B2B?style=for-the-badge&logo=shield&logoColor=white" alt="Better Auth" /></a>
  </p>
</div>

---

## 🌟 Tentang Proyek & Filosofi Desain ("Anti-Slop")

**Portal Semarak 17-an RW 10** adalah aplikasi web berkinerja tinggi (*high-performance web architecture*) yang dirancang khusus untuk memodernisasi tradisi tahunan perayaan Hari Ulang Tahun Kemerdekaan Republik Indonesia (HUT RI) ke-81 di lingkungan RW 10.

Menggunakan filosofi desain **"Anti-Slop"**, sistem ini menolak ketidakteraturan, tampilan berantakan, serta proses manual yang rumit. Proyek ini memadukan estetika kelas dunia, interaktivitas modern 60-FPS, dan kemudahan penggunaan luar biasa baik bagi **Warga / Peserta Lomba** maupun bagi tim **Panitia / Admin Pengelola**.

### ✨ Keunggulan Antarmuka & UX:
* **Font Plus Jakarta Sans:** Menggunakan jenis huruf geometris kebanggaan karya desainer anak bangsa (*Tokotype / Gumpita Rahayu*), diimpor optimalkan secara *self-hosting* tanpa latensi maupun pergeseran layout (*Zero Layout Shift*).
* **Slider Interaktif 60-FPS (Quintic Ease-Out):** Tampilan daftar lomba di beranda desktop dilengkapi animasi luncur horisontal berkekecepatan 60 frame-per-detik, melampar lincah dengan pemberhentian yang empuk dan sangat elegan (*pillowy decelerated stop*). Di layar mobile HP, tampilan difokuskan pada 4 kartu teratas yang bersih dengan pintasan cepat menuju halaman semua lomba.
* **Mode Gelap / Terang & PWA:** Mendukung perpindahan tema *Dark / Light mode* seketika serta berspesifikasi **Progressive Web App (PWA)** sehingga dapat diinstal layaknya aplikasi native di layar HP warga!

---

## 🏆 Fitur Unggulan

### 👥 1. Portal Warga & Peserta (Public Area)
* **Pendaftaran Tanpa Login (*Zero Friction*):** Warga dapat mendaftar lomba perorangan maupun beregu (tim) hanya dalam hitungan detik tanpa harus repot mendaftar akun atau mengingat password.
* **E-Ticket & QR Code Verifikasi:** Pasca mendaftar, warga otomatis menerima lembaran Bukti Pendaftaran digital resmi yang diperkaya dengan kode rakitan **QR Code Unik** untuk otentikasi instan saat registrasi ulang pada Hari Raya Kemerdekaan.
* **Galeri Momen Semarak:** Ruang pameran dokumentasi foto perlombaan yang indah dan beresponsif tinggi:
  * **Filter Kategori Cerdas (Anti-Tab Kosong):** Menyembunyikan seluruh tab kategori lomba yang belum berisi foto, dan akan muncul seketika secara dinamis tatkala Panitia mengunggah minimal 1 foto baru.
  * **Interactive Lightbox & CORS-Free Download:** Warga dapat membuka foto ukuran penuh di layar popup serta mengunduhnya langsung ke perangkat melalui tombol ***Download*** yang ditenagai *Server-Side Proxy* Next.js (terkemas bebas masalah CORS dan tanpa tab baru yang mengganggu).

### 🛠️ 2. Portal Dasbor Panitia & Admin
* **Role-Based Access Control (Better Auth):** Proteksi area pengurus berlapis berbasis sesi aman untuk peran `ADMIN` dan `PANITIA`.
* **Manajemen Lomba & Kategori Umur:** CRUD lengkap mencakup pembatas kuota tim/perorangan, penandaan batas umur, jadwal kegiatan, serta pemantauan kapasitas pendaftar secara real-time.
* **Check-In Kilat QR Code:** Scanner & konfirmasi partisipasi pendaftar saat hadir di lapangan hanya dalam 1 detik.
* **Export Rekap Excel / CSV:** Unduh seluruh rekapitulasi data pendaftar lomba ke format tabel spreadsheet untuk pencetakan daftar hadir dan pelaporan panitia.
* **🧠 Mesin Kompresi Foto Adaptif (*Adaptive Target Compression Engine*):**
  * **Smart Size Safeguard:** Unggahan foto dari panitia berukuran kurang dari **300 KB** dipertahankan keasliannya seutuhnya tanpa proses rendering ulang demi menghindari peningkatan ukuran (*file inflation*).
  * **Iterative Downscaling Engine:** Saat panitia mengunggah foto berukuran raksasa (misal: jepretan kamera DSLR 5 MB hingga 20 MB), mesin kompresi berbasis HTML5 Canvas secara pintar berangsur-angsur menurunkan rasio dan kualitas JPEG hingga bobot file meluncur di bawah **300 KB** dengan menjaga ketajaman visual maksimal di layar!

---

## 💻 Stack Teknologi

* **Framework Utama:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions & React Server Components)
* **Bahasa & Validasi:** [TypeScript](https://www.typescriptlang.org/) & [Zod](https://zod.dev/)
* **Database & ORM:** [Drizzle ORM](https://orm.drizzle.team/) dengan Driver Serverless [Neon PostgreSQL](https://neon.tech/)
* **Otentikasi:** [Better Auth](https://www.better-auth.com/)
* **Styling & UI:** Tailwind CSS, Radix UI / Shadcn primitives, & Lucide React Icons
* **Keamanan Tambahan:** Custom Rate-Limiting Engine & Honeypot anti-bot pendaftar palsu.

---

## 🚀 Panduan Instalasi & Setup (Lokal)

### 1️⃣ Prasyarat Sistem
Pastikan komputer Anda telah memasang **Node.js (>= 18.x)** dan package manager **pnpm** (atau npm / yarn / bun).

### 2️⃣ Kloning & Instalasi Dependensi
```bash
git clone https://github.com/YsrnDev/pendaftaran-lomba.git
cd pendaftaran-lomba
pnpm install
```

### 3️⃣ Konfigurasi Environment Variable
Salin contoh berkas konfigurasi `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Sesuaikan parameter berikut pada berkas `.env.local` Anda (selaras dengan `.env.example`):
```ini
DATABASE_URL="postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="key_supabase_anda"
BETTER_AUTH_SECRET="rahasia_acak_minimal_32_karakter_untuk_enkripsi_sesi"
BETTER_AUTH_URL="http://localhost:3000"
```

### 4️⃣ Sinkronisasi & Migrasi Database
Pilih salah satu dari metode pengiriman skema berikut ke Neon PostgreSQL:
```bash
# Untuk sinkronisasi instan selama masa pengembangan (dev):
pnpm db:push

# Atau jika Anda menggunakan rekam jejak berkas migrasi resmi:
pnpm db:migrate
```

### 5️⃣ Inisialisasi Data Awal (Seeding & Bootstrap)
Isi database dengan daftar lomba perdana dan kategori umur defaulted:
```bash
pnpm db:seed
```

### 6️⃣ Menjalankan Server Pengembangan (Development Server)
```bash
pnpm dev
```
Aplikasi kini mengudara siap pakai di alamat: **`http://localhost:3000`** 🎉

---

## 🔐 Inisialisasi Akun Admin Perdana (Zero-Hardcoded Security)

Portal ini menggunakan sistem pendaftaran administrator berbasis antarmuka web interaktif yang aman dari penulisan *hardcode* kata sandi di file environment:

1. Setelah server lokal Anda mengudara dan database usdah selesai disinkronisasikan (`pnpm dev` & `pnpm db:push`), buka browser dan kunjungi alamat:
   👉 **`http://localhost:3000/setup`**
2. Anda akan disuguhi form pendaftaran visual interaktif untuk merakit email, nama pengelola, serta kata sandi akun Admin pertama Anda.
3. **Fitur Pengaman Otomatis (*Self-Locking Architecture*):** Begitu minimal 1 akun Admin atau Panitia telah berhasil didaftarkan, halaman `/setup` akan otomatis mengunci dan melompat (*redirect*) ke halaman utama login demi perlindungan mutlak terhadap upaya registrasi ilegal dari luar!
4. Masuk ke Dasbor Pengurus menggunakan akun yang barusan Anda rakit melalui:
   👉 **`http://localhost:3000/login`** atau **`http://localhost:3000/portal/login`**

---

## 📜 Katalog Command Skrip

| Perintah Skrip | Deskripsi |
| :--- | :--- |
| `pnpm dev` | Menjalankan server lokal pengembangan (*hot reload*) di port 3000 |
| `pnpm build` | Mengemas aplikasi untuk pemutakhiran produksi berkinerja tinggi |
| `pnpm start` | Menjalankan paket hasil kompilasi build di lingkungan production |
| `pnpm db:push` | Mendorong sinkronisasi skema ORM secara langsung ke PostgreSQL |
| `pnpm db:generate` | Merakit jejak berkas SQL migration baru berdasarkan perubahan di `schema.ts` |
| `pnpm db:migrate` | Menerapkan seluruh berkas SQL migrasi ke sistem database online |
| `pnpm db:seed` | Menanam rekapitulasi data draf permulaan ke dalam tabel database |

---

## 🌐 Panduan Deploy (Vercel / Cloud Engine)

1. Sambungkan repositori GitHub **`YsrnDev/pendaftaran-lomba`** ke akun platform hosting modern kesukaan Anda (seperti [Vercel](https://vercel.com/) atau Railway / Render).
2. Tambahkan variabel lingkungan wajib (`DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `BETTER_AUTH_SECRET`, dan `BETTER_AUTH_URL` sesuai domain online Anda) pada Dasbor Cloud Settings.
3. Jalankan command build `pnpm build`, maka persembahan karya istimewa Semarak 17-an RW 10 ini akan seketika menyala membanggakan warga di pentas digital internet! 🇮🇩✨🔥

---
<div align="center">
  <p>Dibuat dengan semangat kemerdekaan dan kebanggaan 100% dari, oleh, dan untuk <strong>Warga RW 10</strong>. 🏆🇮🇩</p>
</div>
