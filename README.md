# SHOP.CO - Modern Fullstack E-Commerce

**SHOP.CO** adalah aplikasi web E-Commerce responsif yang dibangun menggunakan arsitektur *Headless* (Frontend dan Backend terpisah). Project ini mengimplementasikan fitur belanja lengkap mulai dari katalog produk, varian warna/ukuran, keranjang belanja (cart), hingga sistem autentikasi pengguna.

#### 📸 Tampilan
<img src=Document\shop.co.png>

---

## 🛠️ Teknologi yang Digunakan

**Frontend:**
* **React.js** (Vite) - UI Library
* **Tailwind CSS (v4)** - Styling Framework
* **Axios** - HTTP Client untuk API
* **React Router DOM** - Navigasi Halaman
* **React Hot Toast**: Notifikasi pop-up yang estetik.
* **React Icons** - Ikon Antarmuka

**Backend:**
* **Laravel 11** - PHP Framework (REST API)
* **MySQL** - Database Management
* **Laravel Sanctum** - API Authentication (Token Based)

**Deployment:**
* **Frontend:** Vercel
* **Backend & Database:** Railway

---

## ✨ Fitur Utama

1.  **Homepage Interaktif:**
    * Hero Banner & Brand List.
    * **New Arrivals:** Menampilkan produk terbaru dengan fitur *Toggle View All* (Expand/Collapse).
    * **Browse by Category:** Navigasi cepat ke kategori Pria, Wanita, dan Anak-anak.
2.  **Detail Produk Dinamis:**
    * Galeri foto produk.
    * Pemilihan Varian (Warna & Ukuran) dengan validasi stok.
    * Harga coret (Diskon) otomatis.
3.  **User Authentication:**
    * **Register & Login:** Sistem akun pengguna aman menggunakan token.
    * **Proteksi:** User harus login untuk menambah barang ke keranjang.
4.  **Shopping Cart (Keranjang):**
    * Tambah/Kurang kuantitas barang.
    * Hapus barang dari keranjang.
    * Kalkulasi Subtotal & Total otomatis.
5.  **Checkout System:**
    * Pembuatan Order ID unik (Generate Resi).
    * Simpan riwayat pemesanan ke database.
6.  **Live Search:**
    * Pencarian produk *real-time* dengan *dropdown suggestion* (teknik Debounce).

## 🚀 Cara Menjalankan Proyek Secara Lokal

Proyek ini terdiri dari dua bagian (backend dan frontend) yang harus dijalankan **secara bersamaan** di dua terminal terpisah.

**Prasyarat:**
* **XAMPP:** Pastikan **MySQL** dan **Apache** sudah berjalan (Warna Hijau).
* **Composer:** Manajer paket PHP.
* **Node.js & NPM:** Runtime JavaScript.

---

### 1. Backend (Laravel API)

1.  Buka terminal, masuk ke folder backend:
    ```bash
    cd backend-shop
    ```
2.  Install dependensi PHP:
    ```bash
    composer install
    ```
3.  Salin file konfigurasi environment:
    ```bash
    cp .env.example .env
    ```
4.  Buka file `.env` di text editor dan sesuaikan pengaturan database (pastikan database `shop_co` sudah dibuat di phpMyAdmin):
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=shop_co
    DB_USERNAME=root
    DB_PASSWORD=
    ```
5.  Generate Application Key:
    ```bash
    php artisan key:generate
    ```
6.  Migrasi database dan isi data dummy (Seeding):
    ```bash
    php artisan migrate:fresh --seed
    ```
7.  Jalankan server backend (biarkan terminal ini terbuka):
    ```bash
    php artisan serve
    ```
> 🖥️ **Backend Anda sekarang berjalan di `http://127.0.0.1:8000`**

---

### 2. Frontend (React App)

1.  Buka **terminal BARU** (jangan tutup terminal backend).
2.  Masuk ke folder frontend:
    ```bash
    cd frontend-shop
    ```
3.  Install dependensi JavaScript:
    ```bash
    npm install
    ```
4.  Buat file `.env` baru di dalam folder `frontend-shop`, lalu isi dengan konfigurasi berikut agar terhubung ke backend lokal:
    ```env
    VITE_API_BASE_URL=[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)
    ```
5.  Jalankan server frontend (biarkan terminal ini terbuka):
    ```bash
    npm run dev
    ```
> 🚀 **Frontend Anda sekarang berjalan di `http://localhost:5173`**

---

### 3. Selesai!

Buka URL frontend (`http://localhost:5173`) di browser Anda. Anda sekarang dapat mencoba mendaftar akun, login, dan mulai berbelanja.

---

## 🌍 Deployment

Proyek ini dirancang untuk di-deploy dengan konfigurasi berikut:

* **Backend:** Di-host menggunakan **Railway** (MySQL + Laravel).
* **Frontend:** Di-host menggunakan **Vercel**.
* **Environment Variable:** Pastikan mengganti `VITE_API_BASE_URL` di Vercel menjadi URL domain Railway Anda (https).

## 👤 Penulis

* **Nama:** Rizki Firdaus Purnama
* **Peran:** Fullstack Developer (Student)
* **Institusi:** Binus University