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
    // --- STATISTIK ---
    public function stats()
    {
        return response()->json([
            'total_revenue' => Order::where('status', 'paid')->sum('total_price'),
            'total_orders'  => Order::count(),
            'total_users'   => User::where('role', 'customer')->count(),
            'total_products'=> Product::count()
        ]);
    }

    // --- DATA ORDER & CUSTOMER ---
    public function getAllOrders()
    {
        $orders = Order::with(['user', 'items.product_variant.product.images'])->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    public function getAllCustomers()
    {
        $customers = User::where('role', 'customer')->withCount('orders')->get();
        return response()->json($customers);
    }

    // --- TAMBAH PRODUK ---
    public function addProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'category' => 'required|string', 
            'sizes' => 'required|array',
            'color_name' => 'required|string',
            'color_hex' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // 1. Kategori
        $kategoriInput = $request->category;
        if ($kategoriInput === 'Man') $kategoriInput = 'Men';
        if ($kategoriInput === 'Woman') $kategoriInput = 'Women';

        $categoryEntry = Category::firstOrCreate(
            ['name' => $kategoriInput], ['slug' => Str::slug($kategoriInput)]
        );

        // 2. Produk
        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . time(),
            'description' => $request->description,
            'base_price' => $request->price,
            'category_id' => $categoryEntry->id,
            'rating' => 4.9, 
        ]);

        // 3. Gambar
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => '/storage/' . $path,
            ]);
        }

        // 4. Varian
        foreach ($request->sizes as $size) {
            ProductVariant::create([
                'product_id' => $product->id,
                'size' => $size,
                'color_name' => $request->color_name, 
                'color_hex' => $request->color_hex, 
                'stock_quantity' => 50, 
            ]);
        }

        return response()->json(['message' => 'Product created successfully', 'product' => $product]);
    }

    // --- UPDATE PRODUK (EDIT) ---
    public function updateProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'category' => 'required|string', 
            'sizes' => 'required|array',
            'color_name' => 'required|string',
            'color_hex' => 'required|string',
            // Image nullable (kalau user tidak upload gambar baru, pakai yang lama)
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // 1. Update Info Dasar
        $kategoriInput = $request->category;
        if ($kategoriInput === 'Man') $kategoriInput = 'Men';
        if ($kategoriInput === 'Woman') $kategoriInput = 'Women';

        $categoryEntry = Category::firstOrCreate(
            ['name' => $kategoriInput], ['slug' => Str::slug($kategoriInput)]
        );

        $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'base_price' => $request->price,
            'category_id' => $categoryEntry->id,
        ]);

        // 2. Update Gambar (Jika ada upload baru)
        if ($request->hasFile('image')) {
            // Hapus gambar lama dari storage (Opsional, agar hemat space)
            // ... logic hapus file lama ...

            // Upload baru
            $path = $request->file('image')->store('products', 'public');
            
            // Update record di database (atau hapus lama create baru)
            ProductImage::where('product_id', $product->id)->delete();
            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => '/storage/' . $path,
            ]);
        }

        // 3. Update Varian (Reset & Recreate agar bersih)
        // Hapus semua varian lama
        ProductVariant::where('product_id', $product->id)->delete();

        // Buat varian baru sesuai input form
        foreach ($request->sizes as $size) {
            ProductVariant::create([
                'product_id' => $product->id,
                'size' => $size,
                'color_name' => $request->color_name, 
                'color_hex' => $request->color_hex, 
                'stock_quantity' => 50, // Reset stok ke 50 atau kirim dari frontend jika mau
            ]);
        }

        return response()->json(['message' => 'Product updated successfully']);
    }

    // --- HAPUS PRODUK ---
    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);
        
        // Hapus relasi (Varian & Gambar otomatis terhapus jika settingan DB cascade, 
        // tapi aman dihapus manual juga)
        ProductVariant::where('product_id', $id)->delete();
        ProductImage::where('product_id', $id)->delete();
        
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}