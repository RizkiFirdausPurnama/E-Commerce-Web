import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import CategoryPage from './pages/CategoryPage';
import Success from './pages/Success';
// Import Halaman Login & Register (Pastikan file ini sudah ada)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/ShopPage';
import OnSalePage from './pages/OnSalePage';
import BrandsPage from './pages/BrandsPage';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // Import Auth
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    // 1. AuthProvider HARUS membungkus semuanya
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
        <Toaster 
            position="top-center" 
            reverseOrder={false} 
            toastOptions={{
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                  fontSize: '14px',
                },
                success: {
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#333',
                    },
                },
            }}
          />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/success" element={<Success />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/on-sale" element={<OnSalePage />} />
            <Route path="/brands" element={<BrandsPage />} />
            
            {/* Route untuk Login & Register */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;