<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (Bisa diakses siapa saja)
|--------------------------------------------------------------------------
*/

// Produk & Kategori
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/categories', [ProductController::class, 'categories']);

// Keranjang (Cart) - Masih Public karena pakai Session ID
Route::get('/cart/{sessionId}', [CartController::class, 'index']);
Route::post('/cart', [CartController::class, 'store']);
Route::put('/cart/{id}', [CartController::class, 'update']);
Route::delete('/cart/{id}', [CartController::class, 'destroy']);

// Auth Public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (Hanya untuk User yang sudah Login)
|--------------------------------------------------------------------------
| Middleware 'auth:sanctum' akan mengecek token valid atau tidak.
*/

Route::middleware('auth:sanctum')->group(function () {
    
    // 1. Ambil Data User yang sedang login (PENTING UNTUK NAVBAR)
    Route::get('/user', [AuthController::class, 'user']);

    // 2. Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // 3. Checkout (Pindahkan ke sini agar tercatat siapa yang beli)
    Route::post('/checkout', [OrderController::class, 'checkout']);
    Route::get('/orders', [OrderController::class, 'index']);
});