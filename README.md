# Portfolio - Almalikul Mulki Rhakelino

Proyek portfolio pribadi yang dibangun menggunakan React, Vite, dan Supabase. Proyek ini menampilkan bagian publik (Header, Projects, Skills, Certificates) dan dilengkapi dengan dashboard admin untuk mengelola konten portofolio secara dinamis.

## Teknologi yang Digunakan

*   **Frontend:** React, Vite, Tailwind CSS, Framer Motion
*   **Komponen UI:** Radix UI, shadcn/ui
*   **Routing:** React Router v7
*   **Backend / Database / Auth:** Supabase
*   **Animasi / Canvas:** tsParticles, React Three Fiber

## Struktur Proyek

*   `src/components/`: Komponen UI (Publik dan Admin)
*   `src/Pages/`: Halaman utama (Public Home, Project Detail, Admin Dashboard, Login)
*   `src/supabaseClient.js`: Konfigurasi klien Supabase
*   `src/contexts/`: State management (contoh: ThemeContext untuk mode gelap/terang)

## Prasyarat

Pastikan Anda telah menginstal Node.js dan npm. Anda juga membutuhkan akun Supabase untuk database, storage, dan autentikasi.

## Variabel Lingkungan (.env)

Buat file `.env` di root proyek dan tambahkan kredensial Supabase Anda:

```env
VITE_SUPABASE_URL=URL_SUPABASE_ANDA
VITE_SUPABASE_ANON_KEY=ANON_KEY_SUPABASE_ANDA
```

## Cara Menjalankan Proyek

1. **Instalasi dependensi:**
   ```bash
   npm install
   ```
2. **Jalankan mode pengembangan (development):**
   ```bash
   npm run dev
   ```
3. Buka browser dan arahkan ke `http://localhost:5173`.

## Rute Utama

*   `/` - Halaman Portofolio Publik
*   `/login` - Halaman Login Admin
*   `/dashboard` - Dashboard Admin (Manajemen Konten)

## Pengembangan Lebih Lanjut (To-Do)

*   [ ] Mengubah file CV (PDF) dinamis melalui dashboard admin (Terencana).
*   [ ] Memperbaiki perlindungan rute (Private Route) pada dashboard admin.
