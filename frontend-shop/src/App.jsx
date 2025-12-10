import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'; // Tambah Outlet

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout'; // Pastikan path ini benar

// Pages User
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import CategoryPage from './pages/CategoryPage';
import Success from './pages/Success';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/ShopPage';
import OnSalePage from './pages/OnSalePage';
import BrandsPage from './pages/BrandsPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

// Pages Admin
import DashboardPage from './pages/admin/DashboardPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';

// Context & Utils
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// --- LAYOUT KHUSUS USER (TOKO) ---
// Layout ini menggabungkan Navbar + Halaman Isi + Footer
const ShopLayout = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <Outlet /> {/* Ini tempat halaman (Home/Shop/Cart) dirender */}
      </div>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          
          {/* Toaster tetap di paling luar agar muncul di mana saja */}
          <Toaster 
             position="top-center" 
             toastOptions={{
                style: { borderRadius: '10px', background: '#333', color: '#fff' },
             }}
          />

          <Routes>
            {/* === GRUP 1: HALAMAN TOKO (Pakai Navbar & Footer) === */}
            <Route element={<ShopLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/success" element={<Success />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/on-sale" element={<OnSalePage />} />
                <Route path="/brands" element={<BrandsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/orders" element={<OrderHistoryPage />} />
            </Route>

            {/* === GRUP 2: HALAMAN ADMIN (Pakai Sidebar Khusus) === */}
            {/* Navbar & Footer TIDAK AKAN MUNCUL di sini karena di luar ShopLayout */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} /> 
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />      
                <Route path="/admin/customers" element={<AdminCustomersPage />} />
            </Route>

          </Routes>
          
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;