<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;

// Routes untuk Produk
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/categories', [ProductController::class, 'categories']);

// Routes untuk Keranjang (Cart)
Route::get('/cart/{sessionId}', [CartController::class, 'index']);
Route::post('/cart', [CartController::class, 'store']);
Route::put('/cart/{id}', [CartController::class, 'update']); // Perhatikan parameter {id} adalah ID item keranjang
Route::delete('/cart/{id}', [CartController::class, 'destroy']);

use App\Http\Controllers\OrderController;

Route::post('/checkout', [OrderController::class, 'checkout']);