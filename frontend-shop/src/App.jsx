import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import CategoryPage from './pages/CategoryPage';
import Success from './pages/Success';
// Import Halaman Login & Register (Pastikan file ini sudah ada)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // Import Auth

function App() {
  return (
    // 1. AuthProvider HARUS membungkus semuanya
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/success" element={<Success />} />
            
            {/* Route untuk Login & Register */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;