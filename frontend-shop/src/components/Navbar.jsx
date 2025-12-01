import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiLogOut } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; // 1. Import AuthContext

const Navbar = () => {
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext); // 2. Ambil data user & fungsi logout
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // State untuk dropdown profil
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollToNewArrivals = () => {
    if (location.pathname === '/') {
        const element = document.getElementById('new-arrivals');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        navigate('/', { state: { scrollTo: 'new-arrivals' } });
    }
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
      setShowProfileMenu(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 md:px-10 py-6">
        {/* Logo & Menu Mobile */}
        <div className="flex items-center gap-4">
          <FiMenu className="md:hidden text-2xl cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />
          <Link to="/" className="text-3xl font-black tracking-tighter uppercase font-sans">SHOP.CO</Link>
        </div>
        
        {/* Menu Desktop */}
        <div className="hidden md:flex items-center space-x-6 text-base font-medium">
          <Link to="/category/men" className="hover:underline">Shop</Link>
          <Link to="/category/men" className="hover:underline">On Sale</Link>
          <button onClick={handleScrollToNewArrivals} className="hover:underline font-medium">New Arrivals</button>
          <Link to="/category/kids" className="hover:underline">Brands</Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-3 w-1/3">
          <FiSearch className="text-gray-500 text-xl" />
          <input 
            type="text" 
            placeholder="Search for products..." 
            className="bg-transparent border-none outline-none ml-2 w-full text-sm placeholder-gray-500" 
          />
        </div>

        {/* --- BAGIAN KANAN (LOGIKA LOGIN) --- */}
        <div className="flex items-center space-x-4">
          
          {user ? (
            // SKENARIO 1: SUDAH LOGIN (Tampilkan Cart & User)
            <>
                <Link to="/cart" className="relative">
                    <FiShoppingCart className="text-2xl cursor-pointer hover:text-gray-600 transition" />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                        {cartCount}
                        </span>
                    )}
                </Link>
                
                {/* User Icon dengan Dropdown */}
                <div className="relative">
                    <FiUser 
                        className="text-2xl cursor-pointer hover:text-gray-600 transition" 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    />
                    
                    {/* Dropdown Menu Kecil */}
                    {showProfileMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-xs text-gray-500">Signed in as</p>
                                <p className="font-bold truncate">{user.name}</p>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 flex items-center gap-2 font-medium"
                            >
                                <FiLogOut /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </>
          ) : (
            // SKENARIO 2: BELUM LOGIN (Tampilkan Tombol Login/Register)
            <div className="flex items-center gap-3">
                <Link to="/login" className="px-5 py-2 rounded-full border border-gray-300 font-medium hover:border-black transition">
                    Login
                </Link>
                <Link to="/register" className="px-5 py-2 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition">
                    Sign Up
                </Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;