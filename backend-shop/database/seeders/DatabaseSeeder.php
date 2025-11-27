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
        // ==========================================
        //  AREA GANTI GAMBAR (PASTE LINK DI SINI)
        // ==========================================
        
        // Gambar Kategori (Thumbnail)
        $img_cat_pria   = 'https://static.zara.net/assets/public/68f0/6649/f9cc45c1a9dc/034ca7bcbff5/00706102400-p/00706102400-p.jpg?ts=1757318854477&w=1024';
        $img_cat_wanita = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnJglg7TofRh4g_uIFJUzQ3229OqBBVNzTk29dTFLhJQ&s';
        $img_cat_anak   = 'https://whiteretouch-b4f9.kxcdn.com/wp-content/uploads/2020/04/ZARA_KIDS_1.jpg';

        // 1. T-shirt with Tape Details (Hitam)
        $img_shirt1_depan  = 'https://static.zara.net/assets/public/a32a/2eb7/c3414781aeeb/63c99399f422/03992405800-p/03992405800-p.jpg?ts=1736866610191&w=1024'; 
        $img_shirt1_detail = 'https://placehold.co/600x600/333/white?text=Detail+1';

        // 2. Skinny Fit Jeans (Biru)
        $img_jeans1 = 'https://static.zara.net/assets/public/da36/004b/fcb8481e9242/4376db0fd458/04806330822-p/04806330822-p.jpg?ts=1755612663575&w=1024';

        // 3. Checkered Shirt (Merah Kotak-kotak)
        $img_shirt2 = 'https://static.zara.net/assets/public/4748/f4a7/287041589b10/44630a5e4699/03183711600-e1/03183711600-e1.jpg?ts=1756742037871&w=1024';

        // 4. Gradient Graphic T-shirt (Putih Corak)
        $img_shirt3 = 'https://static.zara.net/assets/public/4734/0d1f/e4db4faab952/729bb8ddbfa8/06224855711-e1/06224855711-e1.jpg?ts=1762863985620&w=744&f=auto';

        // ==========================================
        //  AKHIR AREA GANTI GAMBAR
        // ==========================================


        // --- LOGIKA DATABASE (JANGAN DIUBAH KECUALI PAHAM) ---

        // 1. Buat Kategori
        $pria = Category::create(['name' => 'Pria', 'slug' => 'pria', 'thumbnail_url' => $img_cat_pria]);
        $wanita = Category::create(['name' => 'Wanita', 'slug' => 'wanita', 'thumbnail_url' => $img_cat_wanita]);
        $anak = Category::create(['name' => 'Anak-anak', 'slug' => 'anak-anak', 'thumbnail_url' => $img_cat_anak]);

        // 2. Produk 1: T-shirt with Tape Details
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
        ProductImage::create(['product_id' => $shirt1->id, 'image_url' => $img_shirt1_depan, 'is_primary' => true]);
        ProductImage::create(['product_id' => $shirt1->id, 'image_url' => $img_shirt1_detail, 'is_primary' => false]);
        ProductVariant::create(['product_id' => $shirt1->id, 'color_name' => 'Black', 'color_hex' => '#000000', 'size' => 'M', 'stock_quantity' => 50]);
        ProductVariant::create(['product_id' => $shirt1->id, 'color_name' => 'Black', 'color_hex' => '#000000', 'size' => 'L', 'stock_quantity' => 30]);

        // 3. Produk 2: Skinny Fit Jeans
        $jeans1 = Product::create([
            'category_id' => $pria->id,
            'name' => 'Skinny Fit Jeans',
            'slug' => 'skinny-fit-jeans',
            'description' => 'Celana jeans skinny fit yang nyaman dan elastis.',
            'base_price' => 260.00,
            'discount_percentage' => 20,
            'rating' => 3.5,
            'review_count' => 5
        ]);
        ProductImage::create(['product_id' => $jeans1->id, 'image_url' => $img_jeans1, 'is_primary' => true]);
        ProductVariant::create(['product_id' => $jeans1->id, 'color_name' => 'Blue', 'color_hex' => '#0000FF', 'size' => '32', 'stock_quantity' => 20]);

        // 4. Produk 3: Checkered Shirt
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
        ProductImage::create(['product_id' => $shirt2->id, 'image_url' => $img_shirt2, 'is_primary' => true]);
        ProductVariant::create(['product_id' => $shirt2->id, 'color_name' => 'Red/Blue', 'color_hex' => '#FF0000', 'size' => 'L', 'stock_quantity' => 15]);

        // 5. Produk 4: Gradient Graphic T-shirt
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
        ProductImage::create(['product_id' => $shirt3->id, 'image_url' => $img_shirt3, 'is_primary' => true]);
        ProductVariant::create(['product_id' => $shirt3->id, 'color_name' => 'White', 'color_hex' => '#FFFFFF', 'size' => 'S', 'stock_quantity' => 40]);
    }
}