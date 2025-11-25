import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
const [cartCount, setCartCount] = useState(0);

  // 1. Buat/Ambil Session ID (Agar keranjang tidak hilang saat di-refresh)
  // Kita simpan ID unik di LocalStorage browser
const getSessionId = () => {
    let sessionId = localStorage.getItem('shop_session_id');
    if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('shop_session_id', sessionId);
    }
    return sessionId;
};

const sessionId = getSessionId();

  // 2. Fungsi Ambil Data Keranjang dari Database
const fetchCart = async () => {
    try {
    const res = await axios.get(`http://127.0.0.1:8000/api/cart/${sessionId}`);
      // Hitung total item (misal: beli 2 baju + 1 celana = 3 item)
    const totalItems = res.data.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalItems);
    } catch (err) {
    console.error("Gagal ambil keranjang", err);
    }
};

  // Jalankan fetchCart saat pertama kali web dibuka
useEffect(() => {
    fetchCart();
}, []);

  // 3. Fungsi Tambah ke Keranjang
const addToCart = async (variantId, qty) => {
    try {
    await axios.post('http://127.0.0.1:8000/api/cart', {
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