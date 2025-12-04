import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiLogOut, FiX } from 'react-icons/fi'; // Tambah FiX untuk tombol close
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State ini yang akan kita mainkan
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
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
    setIsMenuOpen(false); // Tutup menu setelah klik
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
      setShowProfileMenu(false);
      setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 md:px-10 py-6">
        
        {/* KIRI: Toggle Menu & Logo */}
        <div className="flex items-center gap-4">
          {/* Tombol Hamburger (Hanya muncul di Mobile) */}
          <FiMenu 
            className="md:hidden text-2xl cursor-pointer" 
            onClick={() => setIsMenuOpen(true)} // Buka menu
          />
          <Link to="/" className="text-3xl font-black tracking-tighter uppercase font-sans">SHOP.CO</Link>
        </div>
        
        {/* TENGAH: Menu Desktop (Hidden di Mobile) */}
        <div className="hidden md:flex items-center space-x-6 text-base font-medium">
          <Link to="/shop" className="hover:underline">Shop</Link>
          <Link to="/on-sale" className="hover:underline">On Sale</Link>
          <button onClick={handleScrollToNewArrivals} className="hover:underline font-medium">New Arrivals</button>
          <Link to="/brands" className="hover:underline">Brands</Link>
        </div>

        {/* Search Bar (Hidden di Mobile, opsional bisa dimunculkan) */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-3 w-1/3">
          <FiSearch className="text-gray-500 text-xl" />
          <input type="text" placeholder="Search for products..." className="bg-transparent border-none outline-none ml-2 w-full text-sm placeholder-gray-500" />
        </div>

        {/* KANAN: Cart & User */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <FiShoppingCart className="text-2xl cursor-pointer hover:text-gray-600 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          
          {/* ... Logika User/Login (Sama seperti sebelumnya) ... */}
          {user ? (
             <div className="relative">
                <FiUser className="text-2xl cursor-pointer" onClick={() => setShowProfileMenu(!showProfileMenu)} />
                {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                        <p className="px-4 py-2 text-xs text-gray-500 font-bold border-b">Hi, {user.name}</p>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 font-bold text-sm hover:bg-gray-50">Logout</button>
                    </div>
                )}
             </div>
          ) : (
             <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="font-bold text-sm">Login</Link>
             </div>
          )}
        </div>
      </div>

      {/* === MOBILE MENU OVERLAY (TAMPILAN MENU HP) === */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
            
            {/* Background Gelap (Klik untuk tutup) */}
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)}></div>
            
            {/* Panel Menu Putih (Slide dari Kiri) */}
            <div className="relative bg-white w-[80%] max-w-[300px] h-full shadow-2xl p-6 flex flex-col gap-6 animate-slide-in">
                
                {/* Header Menu */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-black uppercase">Menu</h2>
                    <FiX className="text-2xl cursor-pointer" onClick={() => setIsMenuOpen(false)} />
                </div>

                {/* Link Navigasi */}
                <nav className="flex flex-col gap-4 text-lg font-medium">
                    <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="border-b pb-2">Shop</Link>
                    <Link to="/on-sale" onClick={() => setIsMenuOpen(false)} className="border-b pb-2">On Sale</Link>
                    <button onClick={handleScrollToNewArrivals} className="text-left border-b pb-2 font-medium">New Arrivals</button>
                    <Link to="/brands" onClick={() => setIsMenuOpen(false)} className="border-b pb-2">Brands</Link>
                </nav>

                {/* Login/Register untuk Mobile (Jika belum login) */}
                {!user && (
                    <div className="mt-auto flex flex-col gap-3">
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-black text-white py-3 rounded-full text-center font-bold">Login</Link>
                        <Link to="/register" onClick={() => setIsMenuOpen(false)} className="border border-black py-3 rounded-full text-center font-bold">Register</Link>
                    </div>
                )}
            </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;