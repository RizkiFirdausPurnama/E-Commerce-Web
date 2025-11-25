import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext';

// Halaman sementara (Placeholder) biar tidak error
const Home = () => <div className="p-10 text-center text-2xl font-bold">Halaman Home (Sedang Dibuat)</div>;
const Cart = () => <div className="p-10 text-center">Halaman Keranjang</div>;
const ProductDetail = () => <div className="p-10 text-center">Halaman Detail Produk</div>;

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;