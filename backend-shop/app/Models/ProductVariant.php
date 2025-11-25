<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $guarded = [];

    // KITA PERLU MENAMBAHKAN INI
    // Agar Laravel tahu varian ini milik produk siapa
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}