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