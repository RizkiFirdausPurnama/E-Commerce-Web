import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail'; // <--- INI PENTING: Import file asli
import { CartProvider } from './context/CartContext';

// Placeholder untuk Cart (masih dummy, nanti kita ganti juga)
const Cart = () => <div className="p-10 text-center">Halaman Keranjang</div>;

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          {/* Route di bawah ini sekarang akan memanggil komponen ProductDetail yang asli */}
          <Route path="/product/:slug" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;