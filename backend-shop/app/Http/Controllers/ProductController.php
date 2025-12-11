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
    public function show($slug)
    {
        // UBAH 3: Load relasi category juga disini
        $product = Product::with(['images', 'variants', 'category'])
                        ->where('slug', $slug)
                        ->firstOrFail();
                        
        return response()->json($product);
    }

    // 3. Mengambil daftar kategori
    public function categories() {
        // Ambil langsung dari tabel categories
        $categories = Category::all();
        return response()->json($categories);
    }
}