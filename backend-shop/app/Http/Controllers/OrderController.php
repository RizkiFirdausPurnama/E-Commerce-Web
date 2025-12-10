<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        $sessionId = $request->session_id;
        
        // 1. AMBIL DATA USER YANG LOGIN
        $user = $request->user(); 

        // 2. Ambil Keranjang
        $cart = Cart::where('session_id', $sessionId)->first();
        if (!$cart) return response()->json(['message' => 'Cart empty'], 400);

        $cartItems = CartItem::with('productVariant.product')->where('cart_id', $cart->id)->get();
        if ($cartItems->isEmpty()) return response()->json(['message' => 'Cart empty'], 400);

        // 3. Hitung Total
        $totalPrice = $cartItems->reduce(function ($total, $item) {
            return $total + ($item->productVariant->product->base_price * $item->quantity);
        }, 0);

        // 4. Proses Transaksi
        // Kita tambahkan $user ke dalam 'use' agar bisa dibaca di dalam fungsi transaksi
        return DB::transaction(function () use ($cart, $cartItems, $totalPrice, $sessionId, $user) {
            
            $uniqueOrderNumber = 'SHOP-' . strtoupper(Str::random(6)) . '-' . date('dm');

            // A. Simpan Data Order
            $order = Order::create([
                'order_number' => $uniqueOrderNumber,
                'session_id' => $sessionId,
                
                // --- BAGIAN INI YANG KITA PERBAIKI ---
                'user_id' => $user->id,       // Simpan ID User
                'customer_name' => $user->name, // Simpan Nama User
                // ------------------------------------
                
                'total_price' => $totalPrice,
                'status' => 'paid'
            ]);

            // B. Pindahkan Barang
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_variant_id' => $item->product_variant_id,
                    'quantity' => $item->quantity,
                    'price' => $item->productVariant->product->base_price,
                ]);
            }

            // C. Hapus Keranjang
            CartItem::where('cart_id', $cart->id)->delete();

            return response()->json([
                'message' => 'Success',
                'order_number' => $uniqueOrderNumber
            ]);
        });
    }
    // Tambahkan method ini di dalam class OrderController
    public function index(Request $request)
    {
        // Ambil pesanan milik user yang sedang login
        // Urutkan dari yang terbaru (latest)
        $orders = Order::where('user_id', auth()->id())
                ->with(['items.product_variant.product.images']) // Load sampai gambar
                ->orderBy('created_at', 'desc')
                ->get();

        return response()->json($orders);
    }
}