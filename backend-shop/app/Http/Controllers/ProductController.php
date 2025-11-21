<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // 1. Mengambil semua produk (bisa difilter)
    public function index(Request $request)
    {
        // Mulai query produk beserta relasinya (kategori, gambar, varian)
        $query = Product::with(['category', 'images', 'variants']);

        // Jika ada request 'category' (misal: ?category=pria)
        if ($request->has('category') && $request->category != 'all') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }
        
        // Jika ada request 'limit' (untuk Homepage)
        if ($request->has('limit')) {
            $query->limit($request->limit);
        }

        // Urutkan dari yang terbaru
        $products = $query->latest()->get();

        return response()->json($products);
    }

    // 2. Mengambil detail 1 produk
    public function show($slug)
    {
        $product = Product::with(['category', 'images', 'variants'])
                        ->where('slug', $slug)
                        ->firstOrFail();
        return response()->json($product);
    }

    // 3. Mengambil daftar kategori untuk sidebar
    public function categories() {
        return response()->json(Category::all());
    }
}