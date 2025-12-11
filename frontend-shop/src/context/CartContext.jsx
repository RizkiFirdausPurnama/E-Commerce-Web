import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const CartContext = createContext();

// --- TAMBAHAN PENTING: Custom Hook useCart ---
// Ini yang bikin error "does not provide an export named useCart" hilang
export const useCart = () => {
    return useContext(CartContext);
};

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

  // 2. Fungsi Ambil Data Keranjang
  const fetchCart = async () => {
    if (!apiUrl) return;

    try {
      const res = await axios.get(`${apiUrl}/cart/${sessionId}`);
      
      if (Array.isArray(res.data)) {
          const totalItems = res.data.reduce((acc, item) => acc + item.quantity, 0);
          setCartCount(totalItems);
      } else {
          setCartCount(0);
      }
    } catch (err) {
      console.error("Gagal ambil keranjang:", err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    if(apiUrl) {
        fetchCart();
    }
  }, [apiUrl]);

  // 3. Fungsi Tambah ke Keranjang (DIPERBAIKI AGAR FLEKSIBEL)
  // Bisa menerima (id, qty) ATAU ({ variant_id, quantity, ... })
  const addToCart = async (arg1, arg2 = 1) => {
    let variantId, qty;

    // Cek apakah arg1 adalah object (dari ProductDetail baru)
    if (typeof arg1 === 'object' && arg1 !== null) {
        variantId = arg1.variant_id; // Ambil ID variant
        qty = arg1.quantity || 1;    // Ambil quantity
    } else {
        // Jika cara lama (dari halaman lain)
        variantId = arg1;
        qty = arg2;
    }

    try {
      await axios.post(`${apiUrl}/cart`, {
        session_id: sessionId,
        product_variant_id: variantId,
        quantity: qty
      });
      
      fetchCart(); // Update navbar
      return true; 
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