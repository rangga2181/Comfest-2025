Proyek Aplikasi Katering - SEA Catering
Ini adalah proyek aplikasi web full-stack untuk layanan katering fiktif bernama SEA Catering. Aplikasi ini dibangun dengan Node.js, Express, dan MySQL, serta mencakup fitur otentikasi, manajemen langganan, dan dashboard untuk pengguna dan admin.

Teknologi yang Digunakan
Frontend: HTML, CSS, JavaScript (Vanilla JS)

Backend: Node.js, Express.js

Database: MySQL

Keamanan: bcrypt untuk hashing, express-session untuk sesi, csurf untuk proteksi CSRF.

Prasyarat
Sebelum memulai, pastikan Anda telah menginstal perangkat lunak berikut:

Node.js (versi LTS direkomendasikan)

XAMPP (untuk menjalankan server Apache & MySQL)

Visual Studio Code dengan ekstensi Live Server.

Panduan Instalasi dan Setup
Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

1. Clone Repository
Buka terminal atau Git Bash dan clone repository ini ke komputer Anda:

Bash

git clone [URL_REPOSITORY_ANDA]
cd [NAMA_FOLDER_PROYEK]
2. Setup Database
Aplikasi ini memerlukan database MySQL untuk berjalan.

Buka XAMPP Control Panel dan klik Start pada modul Apache dan MySQL.

Buka browser Anda dan navigasikan ke http://localhost/phpmyadmin/.

Buat database baru dengan nama sea_catering_db.

Pilih database sea_catering_db yang baru dibuat, lalu klik tab Import.

Klik "Choose File" dan pilih file database.sql dari folder proyek ini, lalu klik Go. Tabel users, subscriptions, dan testimonials akan otomatis dibuat beserta data contoh.

3. Instalasi Backend
Buka terminal di dalam folder proyek dan jalankan perintah berikut untuk menginstal semua dependensi yang dibutuhkan oleh server:

Bash

npm install
Menjalankan Aplikasi
Untuk menjalankan aplikasi, Anda perlu mengaktifkan backend dan frontend secara terpisah.

1. Jalankan Server Backend (Node.js)
Di terminal yang sama (sudah di dalam folder proyek), jalankan perintah:

``node server.js``

Anda akan melihat konfirmasi di terminal: Server aman SEA Catering berjalan di http://localhost:3000.

PENTING: Biarkan jendela terminal ini tetap terbuka. Ini adalah server yang menjadi otak aplikasi Anda.

2. Jalankan Server Frontend (Live Server)
Buka folder proyek di Visual Studio Code.

Di panel file , klik kanan pada file index.html.

Pilih opsi "Open with Live Server".

Selesai! Aplikasi Anda sekarang berjalan sepenuhnya dan siap untuk digunakan.

Akun untuk Testing
Anda bisa menggunakan akun admin default yang sudah dibuat oleh database.sql:

Email: contoh1@gmail.com

Password: Contoh2025$
