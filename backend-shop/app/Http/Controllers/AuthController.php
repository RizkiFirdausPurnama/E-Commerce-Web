<?php

namespace App\Http\Controllers; // <--- Pastikan baris ini benar!

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // 1. REGISTER
    public function register(Request $request)
    {
    // 1. Validasi (Biarkan seperti yang sudah ada)
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8',
    ]);

    // 2. Buat User Baru
    $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'role' => 'customer' // Default user biasa
    ]);

    // 3. (BAGIAN BARU) BUAT TOKEN LANGSUNG
    $token = $user->createToken('auth_token')->plainTextToken;

    // 4. Kembalikan User DAN Token ke Frontend
    return response()->json([
        'message' => 'Register Success',
        'user' => $user,
        'token' => $token, // <-- Ini kuncinya biar auto login
    ], 201);
    }

    // 2. LOGIN
    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid login details'], 401);
        }

        $user = User::where('email', $request['email'])->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login success',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    // 3. LOGOUT
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
    
    // 4. CEK USER
    public function user(Request $request) {
        return response()->json($request->user());
    }
}