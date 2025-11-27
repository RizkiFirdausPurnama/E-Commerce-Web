<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    // --- BARIS INI WAJIB ADA ---
    protected $guarded = []; 

    public function productVariant() {
        return $this->belongsTo(ProductVariant::class);
    }
}