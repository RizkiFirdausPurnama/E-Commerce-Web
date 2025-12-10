<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;


class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // ==========================================
        //  1. SETUP DATA DASAR
        // ==========================================
        
        // Link Gambar
        $img_cat_men   = 'https://static.zara.net/assets/public/68f0/6649/f9cc45c1a9dc/034ca7bcbff5/00706102400-p/00706102400-p.jpg?ts=1757318854477&w=1024';
        $img_cat_women = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnJglg7TofRh4g_uIFJUzQ3229OqBBVNzTk29dTFLhJQ&s';
        $img_cat_kids  = 'https://whiteretouch-b4f9.kxcdn.com/wp-content/uploads/2020/04/ZARA_KIDS_1.jpg';

        $img_shirt1 = 'https://static.zara.net/assets/public/a32a/2eb7/c3414781aeeb/63c99399f422/03992405800-p/03992405800-p.jpg?ts=1736866610191&w=1024';
        $img_jeans1 = 'https://static.zara.net/assets/public/da36/004b/fcb8481e9242/4376db0fd458/04806330822-p/04806330822-p.jpg?ts=1755612663575&w=1024';
        $img_shirt2 = 'https://static.zara.net/assets/public/4748/f4a7/287041589b10/44630a5e4699/03183711600-e1/03183711600-e1.jpg?ts=1756742037871&w=1024';
        $img_shirt3 = 'https://static.zara.net/assets/public/4734/0d1f/e4db4faab952/729bb8ddbfa8/06224855711-e1/06224855711-e1.jpg?ts=1762863985620&w=744&f=auto';
        $img_polo   = 'https://i.pinimg.com/736x/ad/81/4c/ad814c61731543f7ee96feabbf5a1fa0.jpg';
        $img_dress  = 'https://i.pinimg.com/736x/c1/69/e7/c169e7b8318c2378778222c02043b749.jpg';
        $img_hoodie = 'https://static.zara.net/assets/public/3025/f300/3df642079c81/fd96ffc74acb/05431773800-e1/05431773800-e1.jpg?ts=1759999439244&w=1024';
        $img_shorts = 'https://i.pinimg.com/1200x/2d/e2/bd/2de2bdb95b864ff870386bb620084cab.jpg';

        // Buat Kategori
        $men   = Category::create(['name' => 'Men', 'slug' => 'men', 'thumbnail_url' => $img_cat_men]);
        $women = Category::create(['name' => 'Women', 'slug' => 'women', 'thumbnail_url' => $img_cat_women]);
        $kids  = Category::create(['name' => 'Kids', 'slug' => 'kids', 'thumbnail_url' => $img_cat_kids]);

        // ==========================================
        //  2. DEFINISI PRODUK & UKURANNYA
        // ==========================================
        
        $products = [
            // 1. BAJU (Normal)
            [
                'cat_id' => $men->id,
                'name' => 'T-shirt with Tape Details',
                'slug' => 't-shirt-tape-details',
                'price' => 120.00,
                'discount' => 0, // Tidak diskon
                'desc' => 'Kaos modern dengan detail tape yang unik.',
                'img' => $img_shirt1,
                'color' => 'Black', 'hex' => '#000000',
                'sizes' => ['S', 'M', 'L', 'XL'] 
            ],
            // 2. CELANA JEANS (Diskon 20%)
            [
                'cat_id' => $men->id,
                'name' => 'Skinny Fit Jeans',
                'slug' => 'skinny-fit-jeans',
                'price' => 260.00,
                'discount' => 20, // <--- DISKON
                'desc' => 'Celana jeans skinny fit yang nyaman.',
                'img' => $img_jeans1,
                'color' => 'Black', 'hex' => '#000000',
                'sizes' => ['29', '30', '31', '32', '34'] 
            ],
            // 3. KEMEJA (Diskon 15%)
            [
                'cat_id' => $men->id,
                'name' => 'Checkered Shirt',
                'slug' => 'checkered-shirt',
                'price' => 180.00,
                'discount' => 15, // <--- DISKON
                'desc' => 'Kemeja kotak-kotak klasik bahan flanel.',
                'img' => $img_shirt2,
                'color' => 'Red', 'hex' => '#FF3838',
                'sizes' => ['S', 'M', 'L', 'XL']
            ],
            // 4. KAOS WANITA (Normal)
            [
                'cat_id' => $women->id,
                'name' => 'Gradient Graphic T-shirt',
                'slug' => 'gradient-graphic-tshirt',
                'price' => 145.00,
                'discount' => 0,
                'desc' => 'Kaos grafis dengan warna gradasi artistik.',
                'img' => $img_shirt3,
                'color' => 'White', 'hex' => '#FFFFFF',
                'sizes' => ['S', 'M', 'L']
            ],
            // 5. POLO (Normal)
            [
                'cat_id' => $men->id,
                'name' => 'Polo Shirt with Contrast',
                'slug' => 'polo-shirt-contrast',
                'price' => 95.00,
                'discount' => 0,
                'desc' => 'Kaos Polo klasik dengan kerah warna kontras.',
                'img' => $img_polo,
                'color' => 'Cream', 'hex' => '#F0E4D3',
                'sizes' => ['M', 'L', 'XL', 'XXL']
            ],
            // 6. DRESS (Diskon 10%)
            [
                'cat_id' => $women->id,
                'name' => 'Elegant Party Dress',
                'slug' => 'elegant-party-dress',
                'price' => 350.00,
                'discount' => 10, // <--- DISKON
                'desc' => 'Gaun pesta elegan untuk acara formal.',
                'img' => $img_dress,
                'color' => 'Pink', 'hex' => '#FFC0CB',
                'sizes' => ['XS', 'S', 'M']
            ],
            // 7. HOODIE ANAK (Diskon 10%)
            [
                'cat_id' => $kids->id,
                'name' => 'Kids Cartoon Hoodie',
                'slug' => 'kids-cartoon-hoodie',
                'price' => 85.00,
                'discount' => 10, // <--- DISKON
                'desc' => 'Hoodie anak bahan lembut.',
                'img' => $img_hoodie,
                'color' => 'Black', 'hex' => '#000000',
                'sizes' => ['6Y', '8Y', '10Y', '12Y']
            ],
            // 8. CELANA PENDEK ANAK (Normal)
            [
                'cat_id' => $kids->id,
                'name' => 'Comfy Denim Shorts',
                'slug' => 'comfy-denim-shorts',
                'price' => 55.00,
                'discount' => 0,
                'desc' => 'Celana pendek denim untuk bermain.',
                'img' => $img_shorts,
                'color' => 'Blue', 'hex' => '#A7E6FF',
                'sizes' => ['6Y', '8Y', '10Y']
            ],
        ];

        // ==========================================
        //  3. EKSEKUSI OTOMATIS
        // ==========================================
        foreach ($products as $p) {
            $prod = Product::create([
                'category_id' => $p['cat_id'],
                'name' => $p['name'],
                'slug' => $p['slug'],
                'description' => $p['desc'],
                'base_price' => $p['price'],
                'discount_percentage' => $p['discount'], // Masukkan diskon ke database
                'rating' => rand(35, 50) / 10,
                'review_count' => rand(5, 50)
            ]);

            ProductImage::create(['product_id' => $prod->id, 'image_url' => $p['img'], 'is_primary' => true]);

            foreach ($p['sizes'] as $size) {
                ProductVariant::create([
                    'product_id' => $prod->id,
                    'color_name' => $p['color'],
                    'color_hex' => $p['hex'],
                    'size' => $size, 
                    'stock_quantity' => 20
                ]);
            }
        }
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@shop.co',
            'password' => Hash::make('password123'), // Password Admin
            'role' => 'admin' // <--- Ini kuncinya
        ]);

    }
}