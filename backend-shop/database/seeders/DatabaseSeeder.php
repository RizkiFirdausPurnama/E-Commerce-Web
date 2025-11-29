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
        //  1. LINK GAMBAR (PASTE LINK DI SINI)
        // ==========================================
        
        // Gambar Kategori
        $img_cat_men   = 'https://static.zara.net/assets/public/68f0/6649/f9cc45c1a9dc/034ca7bcbff5/00706102400-p/00706102400-p.jpg?ts=1757318854477&w=1024';
        $img_cat_women = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnJglg7TofRh4g_uIFJUzQ3229OqBBVNzTk29dTFLhJQ&s';
        $img_cat_kids  = 'https://whiteretouch-b4f9.kxcdn.com/wp-content/uploads/2020/04/ZARA_KIDS_1.jpg';

        // --- PRODUK LAMA (Sudah pakai link kamu) ---
        // 1. T-shirt Hitam
        $img_shirt1_depan  = 'https://static.zara.net/assets/public/a32a/2eb7/c3414781aeeb/63c99399f422/03992405800-p/03992405800-p.jpg?ts=1736866610191&w=1024'; 
        $img_shirt1_detail = 'https://placehold.co/600x600/333/white?text=Detail+1';

        // 2. Jeans Biru
        $img_jeans1 = 'https://static.zara.net/assets/public/da36/004b/fcb8481e9242/4376db0fd458/04806330822-p/04806330822-p.jpg?ts=1755612663575&w=1024';

        // 3. Kemeja Kotak Merah
        $img_shirt2 = 'https://static.zara.net/assets/public/4748/f4a7/287041589b10/44630a5e4699/03183711600-e1/03183711600-e1.jpg?ts=1756742037871&w=1024';

        // 4. Kaos Corak Putih
        $img_shirt3 = 'https://static.zara.net/assets/public/4734/0d1f/e4db4faab952/729bb8ddbfa8/06224855711-e1/06224855711-e1.jpg?ts=1762863985620&w=744&f=auto';

        // --- PRODUK BARU (Masih Placeholder, Silakan ganti linknya nanti) ---
        $img_polo   = 'https://i.pinimg.com/736x/ad/81/4c/ad814c61731543f7ee96feabbf5a1fa0.jpg';
        $img_dress  = 'https://i.pinimg.com/736x/c1/69/e7/c169e7b8318c2378778222c02043b749.jpg';
        $img_hoodie = 'https://i.pinimg.com/1200x/7c/fa/39/7cfa39a2f77804d8860949b72fc274ab.jpg';
        $img_shorts = 'https://i.pinimg.com/1200x/2d/e2/bd/2de2bdb95b864ff870386bb620084cab.jpg';


        // ==========================================
        //  2. BUAT KATEGORI
        // ==========================================
        $men   = Category::create(['name' => 'Men', 'slug' => 'men', 'thumbnail_url' => $img_cat_men]);
        $women = Category::create(['name' => 'Women', 'slug' => 'women', 'thumbnail_url' => $img_cat_women]);
        $kids  = Category::create(['name' => 'Kids', 'slug' => 'kids', 'thumbnail_url' => $img_cat_kids]);


        // ==========================================
        //  3. BUAT PRODUK (TOTAL 8 ITEM)
        // ==========================================

        // --- PRODUK 1: T-shirt with Tape Details (Men) ---
        $p1 = Product::create([
            'category_id' => $men->id,
            'name' => 'T-shirt with Tape Details',
            'slug' => 't-shirt-tape-details',
            'description' => 'Kaos modern dengan detail tape yang unik.',
            'base_price' => 120.00,
            'rating' => 4.5,
            'review_count' => 10
        ]);
        ProductImage::create(['product_id' => $p1->id, 'image_url' => $img_shirt1_depan, 'is_primary' => true]);
        ProductImage::create(['product_id' => $p1->id, 'image_url' => $img_shirt1_detail, 'is_primary' => false]);
        ProductVariant::create(['product_id' => $p1->id, 'color_name' => 'Black', 'color_hex' => '#000000', 'size' => 'M', 'stock_quantity' => 50]);

        // --- PRODUK 2: Skinny Fit Jeans (Men) ---
        $p2 = Product::create([
            'category_id' => $men->id,
            'name' => 'Skinny Fit Jeans',
            'slug' => 'skinny-fit-jeans',
            'description' => 'Celana jeans skinny fit yang nyaman dan elastis.',
            'base_price' => 260.00,
            'discount_percentage' => 20,
            'rating' => 3.5,
            'review_count' => 5
        ]);
        ProductImage::create(['product_id' => $p2->id, 'image_url' => $img_jeans1, 'is_primary' => true]);
        ProductVariant::create(['product_id' => $p2->id, 'color_name' => 'Blue', 'color_hex' => '#98D8EF', 'size' => '32', 'stock_quantity' => 20]);

        // --- PRODUK 3: Checkered Shirt (Men) ---
        $p3 = Product::create([
            'category_id' => $men->id,
            'name' => 'Checkered Shirt',
            'slug' => 'checkered-shirt',
            'description' => 'Kemeja kotak-kotak klasik bahan flanel.',
            'base_price' => 180.00,
            'rating' => 4.5,
            'review_count' => 12
        ]);
        ProductImage::create(['product_id' => $p3->id, 'image_url' => $img_shirt2, 'is_primary' => true]);
        ProductVariant::create(['product_id' => $p3->id, 'color_name' => 'Red', 'color_hex' => '#FF0000', 'size' => 'L', 'stock_quantity' => 15]);

        // --- PRODUK 4: Gradient Graphic T-shirt (Women) ---
        $p4 = Product::create([
            'category_id' => $women->id,
            'name' => 'Gradient Graphic T-shirt',
            'slug' => 'gradient-graphic-tshirt',
            'description' => 'Kaos grafis dengan warna gradasi yang artistik.',
            'base_price' => 145.00,
            'rating' => 3.5,
            'review_count' => 8
        ]);
        ProductImage::create(['product_id' => $p4->id, 'image_url' => $img_shirt3, 'is_primary' => true]);
        ProductVariant::create(['product_id' => $p4->id, 'color_name' => 'White', 'color_hex' => '#FFFFFF', 'size' => 'S', 'stock_quantity' => 40]);

        // --- PRODUK 5 (BARU): Polo Shirt with Contrast (Men) ---
        $p5 = Product::create([
            'category_id' => $men->id,
            'name' => 'Polo Shirt with Contrast',
            'slug' => 'polo-shirt-contrast',
            'description' => 'Kaos Polo klasik dengan kerah warna kontras.',
            'base_price' => 95.00,
            'rating' => 4.0,
            'review_count' => 15
        ]);
        ProductImage::create(['product_id' => $p5->id, 'image_url' => $img_polo, 'is_primary' => true]);
        ProductVariant::create(['product_id' => $p5->id, 'color_name' => 'Green', 'color_hex' => '#FAF1E6', 'size' => 'L', 'stock_quantity' => 25]);

        // --- PRODUK 6 (BARU): Elegant Party Dress (Women) ---
        $p6 = Product::create([
            'category_id' => $women->id,
            'name' => 'Elegant Party Dress',
            'slug' => 'elegant-party-dress',
            'description' => 'Gaun pesta elegan yang cocok untuk acara formal.',
            'base_price' => 350.00,
            'discount_percentage' => 10,
            'rating' => 4.8,
            'review_count' => 42
        ]);
        ProductImage::create(['product_id' => $p6->id, 'image_url' => $img_dress, 'is_primary' => true]);
        ProductVariant::create(['product_id' => $p6->id, 'color_name' => 'Pink', 'color_hex' => '#FFC0CB', 'size' => 'M', 'stock_quantity' => 10]);

        // --- PRODUK 7 (BARU): Kids Cartoon Hoodie (Kids) ---
        $p7 = Product::create([
            'category_id' => $kids->id,
            'name' => 'Kids Cartoon Hoodie',
            'slug' => 'kids-cartoon-hoodie',
            'description' => 'Hoodie anak dengan gambar kartun lucu dan bahan lembut.',
            'base_price' => 85.00,
            'rating' => 4.2,
            'review_count' => 30
        ]);
        ProductImage::create(['product_id' => $p7->id, 'image_url' => $img_hoodie, 'is_primary' => true]);
        ProductVariant::create(['product_id' => $p7->id, 'color_name' => 'Orange', 'color_hex' => '#FFA500', 'size' => 'S', 'stock_quantity' => 50]);

        // --- PRODUK 8 (BARU): Denim Shorts (Kids) ---
        $p8 = Product::create([
            'category_id' => $kids->id,
            'name' => 'Comfy Denim Shorts',
            'slug' => 'comfy-denim-shorts',
            'description' => 'Celana pendek denim yang nyaman untuk bermain.',
            'base_price' => 55.00,
            'rating' => 4.0,
            'review_count' => 18
        ]);
        ProductImage::create(['product_id' => $p8->id, 'image_url' => $img_shorts, 'is_primary' => true]);
        ProductVariant::create(['product_id' => $p8->id, 'color_name' => 'Navy', 'color_hex' => '#9CC6DB', 'size' => 'M', 'stock_quantity' => 60]);
    }
}