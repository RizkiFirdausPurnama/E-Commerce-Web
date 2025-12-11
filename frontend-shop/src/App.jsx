import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'; 

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout'; 

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
import AddProductPage from './pages/admin/AddProductPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';

// Context & Utils
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// --- LAYOUT KHUSUS USER (TOKO) ---
const ShopLayout = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <Outlet />
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
          
          <Toaster 
            position="top-center" 
            toastOptions={{
                style: { borderRadius: '10px', background: '#333', color: '#fff' },
            }}
          />

          <Routes>
            {/* === GRUP 1: HALAMAN TOKO === */}
            <Route element={<ShopLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                
                {/* UBAH 1: Sesuaikan parameter dengan CategoryPage.jsx (:categoryName) */}
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                
                <Route path="/success" element={<Success />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/on-sale" element={<OnSalePage />} />
                <Route path="/brands" element={<BrandsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/orders" element={<OrderHistoryPage />} />
            </Route>

            {/* === GRUP 2: HALAMAN ADMIN === */}
            <Route path="/admin" element={<AdminLayout />}>
                {/* Dashboard Default */}
                <Route index element={<DashboardPage />} /> 
                <Route path="dashboard" element={<DashboardPage />} />

                <Route path="products" element={<AdminProductsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />      
                
                <Route path="customers" element={<AdminCustomersPage />} />
                <Route path="add-product" element={<AddProductPage />} />
            </Route>

          </Routes>
          
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;