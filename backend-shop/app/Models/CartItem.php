<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    // BARIS INI PENTING! 
    // Kalau tidak ada, Laravel menolak menyimpan data variant_id & quantity
    protected $guarded = [];

    // Relasi agar bisa ambil nama produk & gambar
    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class);
    }
}