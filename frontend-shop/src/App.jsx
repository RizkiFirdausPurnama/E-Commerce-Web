import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import CategoryPage from './pages/CategoryPage'; // <--- 1. Import ini
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          
          {/* 2. Tambahkan Route Kategori di bawah ini */}
          <Route path="/category/:slug" element={<CategoryPage />} />
          
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;