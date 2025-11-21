<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // 1. Lihat isi keranjang berdasarkan Session ID
    public function index($sessionId)
    {
        $cart = Cart::where('session_id', $sessionId)->first();
        
        if (!$cart) {
            return response()->json([]);
        }

        // Ambil item beserta info produknya
        $items = CartItem::with(['productVariant.product.images'])
                         ->where('cart_id', $cart->id)
                         ->get();

        return response()->json($items);
    }

    // 2. Tambah barang ke keranjang
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'session_id' => 'required',
            'product_variant_id' => 'required',
            'quantity' => 'required|integer|min:1'
        ]);

        // Cari atau Buat Keranjang baru untuk user ini
        $cart = Cart::firstOrCreate(
            ['session_id' => $request->session_id]
        );

        // Cek apakah barang ini sudah ada di keranjang?
        $item = CartItem::where('cart_id', $cart->id)
                        ->where('product_variant_id', $request->product_variant_id)
                        ->first();

        if ($item) {
            // Kalau sudah ada, tambahkan jumlahnya
            $item->quantity += $request->quantity;
            $item->save();
        } else {
            // Kalau belum, buat item baru
            CartItem::create([
                'cart_id' => $cart->id,
                'product_variant_id' => $request->product_variant_id,
                'quantity' => $request->quantity
            ]);
        }

        return response()->json(['message' => 'Item added to cart']);
    }

    // 3. Update jumlah barang (tombol + / -)
    public function update(Request $request, $id)
    {
        $item = CartItem::find($id);
        if($item) {
            $item->quantity = $request->quantity;
            $item->save();
        }
        return response()->json(['message' => 'Updated']);
    }

    // 4. Hapus barang dari keranjang
    public function destroy($id)
    {
        CartItem::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}