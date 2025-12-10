<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

    protected $guarded = [];

    // 👇 Relasi ke Product Utama (INI JUGA WAJIB ADA)
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}