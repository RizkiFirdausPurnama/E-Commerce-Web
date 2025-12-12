<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category; // Kita pakai Model Category lagi
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // 1. Mengambil semua produk (bisa difilter)
    public function index(Request $request)
    {
        // UBAH 1: Tambahkan 'category' ke dalam with() agar frontend tahu nama kategorinya
        $query = Product::with(['images', 'variants', 'category']);

        // UBAH 2: Filter menggunakan RELASI (whereHas), bukan kolom string biasa
        if ($request->has('category') && $request->category != 'all') {
            $kategoriDicari = $request->category; // Misal: "men"

            // Logic Baru (Relasi):
            // "Cari produk yang punya Kategori, dimana Slug atau Nama kategori tersebut cocok"
            $query->whereHas('category', function($q) use ($kategoriDicari) {
                $q->where('slug', $kategoriDicari)
                  ->orWhere('name', $kategoriDicari); 
            });
        }

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where('name', 'LIKE', "%{$searchTerm}%");
        }

        if ($request->has('limit')) {
            $query->limit($request->limit);
        }

        $products = $query->latest()->get();

        return response()->json($products);
    }

    // 2. Mengambil detail 1 produk
    public function show($key)
    {
        $query = Product::with(['images', 'variants', 'category']);

        // LOGIC BARU: Cek apakah $key adalah angka (ID) atau string (Slug)
        if (is_numeric($key)) {
            // Jika angka, cari berdasarkan ID (Dipakai oleh Admin Edit Page)
            $product = $query->where('id', $key)->firstOrFail();
        } else {
            // Jika text, cari berdasarkan Slug (Dipakai oleh User Detail Page)
            $product = $query->where('slug', $key)->firstOrFail();
        }
                        
        return response()->json($product);
    }

    // 3. Mengambil daftar kategori
    public function categories() {
        // Ambil langsung dari tabel categories
        $categories = Category::all();
        return response()->json($categories);
    }
}