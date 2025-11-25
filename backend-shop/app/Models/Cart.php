<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Opsional
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    // BARIS INI WAJIB ADA AGAR BISA DISIMPAN
    protected $guarded = [];

    // Relasi (Opsional, tapi bagus kalau ada)
    public function items()
    {
        return $this->hasMany(CartItem::class);
    }
}