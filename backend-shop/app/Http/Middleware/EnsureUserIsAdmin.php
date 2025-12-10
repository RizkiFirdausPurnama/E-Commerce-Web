<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Cek apakah user sudah login?
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // 2. Cek apakah role-nya 'admin'?
        if (Auth::user()->role !== 'admin') {
            // Kalau bukan admin, tendang keluar (Forbidden)
            return response()->json(['message' => 'Access Denied. Admins only.'], 403);
        }

        // 3. Kalau aman, silakan lanjut
        return $next($request);
    }
}