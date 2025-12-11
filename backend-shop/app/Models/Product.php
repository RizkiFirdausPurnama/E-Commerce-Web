<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // Izinkan semua kolom diisi
    protected $guarded = [];

    // Relasi ke Category
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    // Relasi ke Varian (Size/Warna)
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    // Relasi ke Gambar
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
}