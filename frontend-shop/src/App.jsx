import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home'; // <--- Import Home yang asli
import { CartProvider } from './context/CartContext';

// Placeholder halaman lain (nanti kita buat juga)
const Cart = () => <div className="p-10 text-center">Halaman Keranjang</div>;
const ProductDetail = () => <div className="p-10 text-center">Halaman Detail Produk</div>;

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} /> {/* Panggil komponen Home */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;