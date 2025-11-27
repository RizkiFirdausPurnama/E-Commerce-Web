<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    // --- BARIS INI WAJIB ADA ---
    protected $guarded = []; 

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}