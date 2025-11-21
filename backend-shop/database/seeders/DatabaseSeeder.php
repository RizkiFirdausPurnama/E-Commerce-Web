<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // 1. Buat Kategori
        $pria = Category::create(['name' => 'Pria', 'slug' => 'pria', 'thumbnail_url' => 'https://placehold.co/200x200/png?text=Men']);
        $wanita = Category::create(['name' => 'Wanita', 'slug' => 'wanita', 'thumbnail_url' => 'https://placehold.co/200x200/png?text=Women']);
        $anak = Category::create(['name' => 'Anak-anak', 'slug' => 'anak-anak', 'thumbnail_url' => 'https://placehold.co/200x200/png?text=Kids']);

        // 2. Buat Produk Contoh: T-shirt with Tape Details
        $shirt1 = Product::create([
            'category_id' => $pria->id,
            'name' => 'T-shirt with Tape Details',
            'slug' => 't-shirt-tape-details',
            'description' => 'Kaos modern dengan detail tape yang unik, cocok untuk gaya kasual sehari-hari.',
            'base_price' => 120.00,
            'discount_percentage' => 0,
            'rating' => 4.5,
            'review_count' => 10
        ]);
        
        // Gambar Produk 1
        ProductImage::create(['product_id' => $shirt1->id, 'image_url' => 'https://placehold.co/600x600/black/white?text=T-Shirt+Black', 'is_primary' => true]);
        ProductImage::create(['product_id' => $shirt1->id, 'image_url' => 'https://placehold.co/600x600/333/white?text=Detail+1', 'is_primary' => false]);
        
        // Varian Produk 1
        ProductVariant::create(['product_id' => $shirt1->id, 'color_name' => 'Black', 'color_hex' => '#000000', 'size' => 'M', 'stock_quantity' => 50]);
        ProductVariant::create(['product_id' => $shirt1->id, 'color_name' => 'Black', 'color_hex' => '#000000', 'size' => 'L', 'stock_quantity' => 30]);


        // 3. Buat Produk Contoh: Skinny Fit Jeans
        $jeans1 = Product::create([
            'category_id' => $pria->id,
            'name' => 'Skinny Fit Jeans',
            'slug' => 'skinny-fit-jeans',
            'description' => 'Celana jeans skinny fit yang nyaman dan elastis.',
            'base_price' => 260.00,
            'discount_percentage' => 20, // Diskon 20%
            'rating' => 3.5,
            'review_count' => 5
        ]);

        ProductImage::create(['product_id' => $jeans1->id, 'image_url' => 'https://placehold.co/600x600/blue/white?text=Jeans+Blue', 'is_primary' => true]);
        ProductVariant::create(['product_id' => $jeans1->id, 'color_name' => 'Blue', 'color_hex' => '#0000FF', 'size' => '32', 'stock_quantity' => 20]);


        // 4. Buat Produk Contoh: Checkered Shirt
        $shirt2 = Product::create([
            'category_id' => $pria->id,
            'name' => 'Checkered Shirt',
            'slug' => 'checkered-shirt',
            'description' => 'Kemeja kotak-kotak klasik bahan flanel.',
            'base_price' => 180.00,
            'discount_percentage' => 0,
            'rating' => 4.5,
            'review_count' => 12
        ]);
        ProductImage::create(['product_id' => $shirt2->id, 'image_url' => 'https://placehold.co/600x600/red/white?text=Checkered+Shirt', 'is_primary' => true]);
        ProductVariant::create(['product_id' => $shirt2->id, 'color_name' => 'Red/Blue', 'color_hex' => '#FF0000', 'size' => 'L', 'stock_quantity' => 15]);

        // 5. Buat Produk Contoh: Gradient Graphic T-shirt
        $shirt3 = Product::create([
            'category_id' => $wanita->id,
            'name' => 'Gradient Graphic T-shirt',
            'slug' => 'gradient-graphic-tshirt',
            'description' => 'Kaos grafis dengan warna gradasi yang artistik.',
            'base_price' => 145.00,
            'discount_percentage' => 0,
            'rating' => 3.5,
            'review_count' => 8
        ]);
        ProductImage::create(['product_id' => $shirt3->id, 'image_url' => 'https://placehold.co/600x600/white/black?text=Gradient+Tee', 'is_primary' => true]);
        ProductVariant::create(['product_id' => $shirt3->id, 'color_name' => 'White', 'color_hex' => '#FFFFFF', 'size' => 'S', 'stock_quantity' => 40]);
    }
}