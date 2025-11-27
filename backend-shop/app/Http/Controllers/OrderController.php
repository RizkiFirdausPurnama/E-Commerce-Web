<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str; // Untuk buat string acak

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        $sessionId = $request->session_id;

        // 1. Ambil Keranjang
        $cart = Cart::where('session_id', $sessionId)->first();
        if (!$cart) return response()->json(['message' => 'Cart empty'], 400);

        $cartItems = CartItem::with('productVariant.product')->where('cart_id', $cart->id)->get();
        if ($cartItems->isEmpty()) return response()->json(['message' => 'Cart empty'], 400);

        // 2. Hitung Total
        $totalPrice = $cartItems->reduce(function ($total, $item) {
            return $total + ($item->productVariant->product->base_price * $item->quantity);
        }, 0);

        // 3. Proses Transaksi (Pakai DB Transaction biar aman)
        return DB::transaction(function () use ($cart, $cartItems, $totalPrice, $sessionId) {
            
            // Generate Nomor Order Unik (Contoh: SHOP-A1B2C3)
            $uniqueOrderNumber = 'SHOP-' . strtoupper(Str::random(6)) . '-' . date('dm');

            // A. Simpan Data Order
            $order = Order::create([
                'order_number' => $uniqueOrderNumber,
                'session_id' => $sessionId,
                'total_price' => $totalPrice,
                'customer_name' => 'Guest User',
                'status' => 'paid'
            ]);

            // B. Pindahkan Barang dari Cart ke Order Items
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_variant_id' => $item->product_variant_id,
                    'quantity' => $item->quantity,
                    'price' => $item->productVariant->product->base_price,
                ]);
            }

            // C. Hapus Isi Keranjang (Karena sudah dibeli)
            CartItem::where('cart_id', $cart->id)->delete();

            return response()->json([
                'message' => 'Success',
                'order_number' => $uniqueOrderNumber // Kirim nomor unik ini ke Frontend
            ]);
        });
    }
}