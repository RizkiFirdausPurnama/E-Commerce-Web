<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

// Import Model
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use App\Models\Category; 

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_revenue' => Order::where('status', 'paid')->sum('total_price'),
            'total_orders'  => Order::count(),
            'total_users'   => User::where('role', 'customer')->count(),
            'total_products'=> Product::count()
        ]);
    }

    public function getAllOrders()
    {
        $orders = Order::with(['user', 'items.product_variant.product.images'])
                        ->orderBy('created_at', 'desc')
                        ->get();
        return response()->json($orders);
    }

    public function getAllCustomers()
    {
        $customers = User::where('role', 'customer')
                        ->withCount('orders')
                        ->get();
        return response()->json($customers);
    }

    public function addProduct(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'category' => 'required|string', 
            'sizes' => 'required|array',
            
            // Validasi Warna
            'color_name' => 'required|string',
            'color_hex' => 'required|string',

            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // --- FITUR PINTAR: NORMALISASI KATEGORI ---
        $kategoriInput = $request->category;
        if ($kategoriInput === 'Man') $kategoriInput = 'Men';
        if ($kategoriInput === 'Woman') $kategoriInput = 'Women';

        // Cari atau Buat Kategori
        $categoryEntry = Category::firstOrCreate(
            ['name' => $kategoriInput], 
            ['slug' => Str::slug($kategoriInput)]
        );

        // 2. Buat Data Produk Utama
        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . time(),
            'description' => $request->description,
            'base_price' => $request->price,
            'category_id' => $categoryEntry->id,
            'rating' => 4.9, 
        ]);

        // 3. Upload Gambar
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            
            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => '/storage/' . $path,
                // 'alt_text' => $product->name  <-- Tetap dimatikan (tidak ada kolomnya)
            ]);
        }

        // 4. Buat Varian Ukuran
        foreach ($request->sizes as $size) {
            ProductVariant::create([
                'product_id' => $product->id,
                'size' => $size,
                'color_name' => $request->color_name, 
                'color_hex' => $request->color_hex, 
                
                // --- PERBAIKAN FINAL DISINI ---
                // Nama kolom di database kamu adalah 'stock_quantity'
                'stock_quantity' => 50, 
            ]);
        }

        return response()->json(['message' => 'Product created successfully', 'product' => $product]);
    }
}