<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $guarded = [];

    // 👇 Relasi ke Order (Order Induk)
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // 👇 Relasi ke Product Variant (INI YANG KEMUNGKINAN HILANG)
    // Nama fungsi harus 'product_variant' sesuai yang kita tulis di Controller
    public function product_variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}