import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Ambil URL dari Environment Variable Vercel
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // 1. Buat/Ambil Session ID
  const getSessionId = () => {
    let sessionId = localStorage.getItem('shop_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('shop_session_id', sessionId);
    }
    return sessionId;
  };

  const sessionId = getSessionId();

  // 2. Fungsi Ambil Data Keranjang (DIPERBAIKI)
  const fetchCart = async () => {
    // Jangan fetch kalau URL API belum ada
    if (!apiUrl) return;

    try {
      const res = await axios.get(`${apiUrl}/cart/${sessionId}`);
      
      // --- BAGIAN PENGAMAN (FIX) ---
      // Cek apakah data yang diterima benar-benar Array?
      if (Array.isArray(res.data)) {
          const totalItems = res.data.reduce((acc, item) => acc + item.quantity, 0);
          setCartCount(totalItems);
      } else {
          // Jika bukan array (misal error object), set 0 biar gak crash
          console.warn("Response keranjang bukan array:", res.data);
          setCartCount(0);
      }
      // ----------------------------

    } catch (err) {
      console.error("Gagal ambil keranjang:", err);
      // Jika error 404 (keranjang belum ada), itu wajar, set 0
      setCartCount(0);
    }
  };

  // Jalankan fetchCart saat pertama kali web dibuka
  useEffect(() => {
    if(apiUrl) {
        fetchCart();
    }
  }, [apiUrl]);

  // 3. Fungsi Tambah ke Keranjang
  const addToCart = async (variantId, qty) => {
    try {
      await axios.post(`${apiUrl}/cart`, {
        session_id: sessionId,
        product_variant_id: variantId,
        quantity: qty
      });
      // Update jumlah di navbar setelah berhasil simpan
      fetchCart(); 
      return true; // Beri tanda sukses
    } catch (err) {
      console.error("Gagal tambah ke cart", err);
      return false;
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart, sessionId, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};