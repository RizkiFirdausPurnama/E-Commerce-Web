<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;

class AdminController extends Controller
{
    // GET /api/admin/stats
    public function stats()
    {
        return response()->json([
            'total_revenue' => Order::where('status', 'paid')->sum('total_price'), // Total Duit Masuk
            'total_orders'  => Order::count(), // Jumlah Pesanan
            'total_users'   => User::where('role', 'customer')->count(), // Jumlah Customer
            'total_products'=> Product::count() // Jumlah Produk
        ]);
    }

    public function getAllOrders()
    {
        // 'user' adalah nama relasi di model Order (pastikan ada function user() di model Order)
        $orders = Order::with(['user', 'items.product_variant.product.images'])
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json($orders);
    }

    // 2. Ambil User yang pernah order (Customer)
    public function getAllCustomers()
    {
        // Ambil user role customer, sekalian hitung berapa kali dia order
        $customers = User::where('role', 'customer')
                        ->withCount('orders') // Menghitung jumlah order per user
                        ->get();
                        
        return response()->json($customers);
    }
}