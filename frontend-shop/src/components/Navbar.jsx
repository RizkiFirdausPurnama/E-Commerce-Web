import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiLogOut, FiX, FiChevronRight } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // --- STATE SEARCH ---
  const [showMobileSearch, setShowMobileSearch] = useState(false); // Untuk toggle search di HP
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]); 
  const [showSuggestions, setShowSuggestions] = useState(false); // Untuk dropdown desktop
  
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const searchRef = useRef(null); 

  // --- LOGIKA LIVE SEARCH (DEBOUNCE) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 2) { 
        fetchSuggestions(searchTerm);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchSuggestions = async (query) => {
    try {
      const res = await axios.get(`${apiUrl}/products?search=${query}&limit=5`);
      if (Array.isArray(res.data)) {
          setSuggestions(res.data.slice(0, 5)); 
          setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Tutup dropdown desktop jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
        if(searchTerm.trim()) {
            navigate(`/shop?search=${searchTerm}`);
            setShowSuggestions(false);
            setShowMobileSearch(false); // Tutup juga di mobile
        }
    }
  };

  const handleScrollToNewArrivals = () => {
    if (location.pathname === '/') {
        const element = document.getElementById('new-arrivals');
        if (element) { element.scrollIntoView({ behavior: 'smooth' }); }
    } else {
        navigate('/', { state: { scrollTo: 'new-arrivals' } });
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
      setShowProfileMenu(false);
      setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 font-sans">
      <div className="flex items-center justify-between px-6 md:px-10 py-6 relative">
        
        {/* KIRI: Toggle Menu & Logo */}
        <div className="flex items-center gap-4">
          <FiMenu className="md:hidden text-2xl cursor-pointer" onClick={() => setIsMenuOpen(true)} />
          <Link to="/" className="text-3xl font-black tracking-tighter uppercase">SHOP.CO</Link>
        </div>
        
        {/* TENGAH: Menu Desktop (Hidden di Mobile) */}
        <div className="hidden md:flex items-center space-x-6 text-base font-medium">
          <Link to="/shop" className="hover:underline">Shop</Link>
          <Link to="/on-sale" className="hover:underline">On Sale</Link>
          <button onClick={handleScrollToNewArrivals} className="hover:underline font-medium">New Arrivals</button>
          <Link to="/brands" className="hover:underline">Brands</Link>
        </div>

        {/* --- SEARCH BAR DESKTOP (Hidden di Mobile) --- */}
        <div className="hidden md:flex items-center w-1/3 relative" ref={searchRef}>
          <div className="flex items-center bg-[#F0F0F0] rounded-full px-4 py-3 w-full transition-all focus-within:ring-2 focus-within:ring-gray-200">
            <FiSearch className="text-gray-500 text-xl cursor-pointer" onClick={handleSearchSubmit} />
            <input 
              type="text" 
              placeholder="Search for products..." 
              className="bg-transparent border-none outline-none ml-2 w-full text-sm placeholder-gray-500" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchSubmit}
              onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
            />
            {searchTerm && (
                <FiX className="text-gray-400 cursor-pointer hover:text-black" onClick={() => {setSearchTerm(''); setShowSuggestions(false)}} />
            )}
          </div>

          {/* Dropdown Desktop */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="py-2">
                    <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Top Results</p>
                    {suggestions.map((product) => (
                        <Link 
                            to={`/product/${product.slug}`} 
                            key={product.id}
                            onClick={() => { setShowSuggestions(false); setSearchTerm(''); }}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer group"
                        >
                            <img src={product.images[0]?.image_url} alt={product.name} className="w-10 h-10 rounded-md object-cover bg-gray-200" />
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-800 group-hover:text-black">{product.name}</h4>
                                <p className="text-xs text-gray-500">${product.base_price}</p>
                            </div>
                            <FiChevronRight className="text-gray-300 group-hover:text-black" />
                        </Link>
                    ))}
                </div>
            </div>
          )}
        </div>

        {/* KANAN: Icons Mobile & Desktop */}
        <div className="flex items-center space-x-4">
          
          {/* 1. IKON SEARCH MOBILE (Hanya muncul di Mobile) */}
          <FiSearch 
            className="md:hidden text-2xl cursor-pointer hover:text-gray-600" 
            onClick={() => setShowMobileSearch(!showMobileSearch)} 
          />

          {/* 2. Cart */}
          <Link to="/cart" className="relative">
            <FiShoppingCart className="text-2xl cursor-pointer hover:text-gray-600 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          
          {/* 3. User / Login */}
          {user ? (
            <div className="relative">
                <FiUser className="text-2xl cursor-pointer" onClick={() => setShowProfileMenu(!showProfileMenu)} />
                {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                        <p className="px-4 py-2 text-xs text-gray-500 font-bold border-b">Hi, {user.name}</p>
                        <Link 
                          to="/orders" 
                          onClick={() => setShowProfileMenu(false)}
                          className="block w-full text-left px-4 py-2 text-black font-medium text-sm hover:bg-gray-50"
                        >My Orders 
                        </Link>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 font-bold text-sm hover:bg-gray-50">Logout</button>
                    </div>
                )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-sm font-bold border border-gray-300 rounded-full hover:border-black transition">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-bold bg-black text-white rounded-full hover:bg-gray-800 transition">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {/* === MOBILE SEARCH OVERLAY (DROPDOWN JUGA MUNCUL DI SINI) === */}
      {showMobileSearch && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white z-40 shadow-xl border-t border-gray-100 p-4 animate-slide-in">
            {/* Input Mobile */}
            <div className="flex items-center bg-[#F0F0F0] rounded-full px-4 py-3 mb-4">
                <FiSearch className="text-gray-500 text-lg" />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="bg-transparent border-none outline-none ml-2 w-full text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    autoFocus
                />
                <FiX className="text-gray-500 text-xl cursor-pointer" onClick={() => { setShowMobileSearch(false); setSearchTerm(''); }} />
            </div>

            {/* Hasil Dropdown Mobile */}
            {suggestions.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase bg-gray-50">Top Results</p>
                    {suggestions.map((product) => (
                        <Link 
                            to={`/product/${product.slug}`} 
                            key={product.id}
                            onClick={() => {
                                setShowMobileSearch(false);
                                setSearchTerm('');
                            }}
                            className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 active:bg-gray-50"
                        >
                            <img src={product.images[0]?.image_url} alt={product.name} className="w-12 h-12 rounded object-cover bg-gray-100" />
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                                <p className="text-xs text-gray-500">${product.base_price}</p>
                            </div>
                        </Link>
                    ))}
                    <div 
                        onClick={() => { 
                            navigate(`/shop?search=${searchTerm}`); 
                            setShowMobileSearch(false); 
                        }}
                        className="block text-center py-3 text-xs font-bold text-black bg-gray-50 cursor-pointer"
                    >
                        View all results
                    </div>
                </div>
            )}
        </div>
      )}

      {/* === MOBILE MENU SIDEBAR (Garis Tiga) === */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)}></div>
            <div className="relative bg-white w-[80%] max-w-[300px] h-full shadow-2xl p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-black uppercase">Menu</h2>
                    <FiX className="text-2xl cursor-pointer" onClick={() => setIsMenuOpen(false)} />
                </div>
                
                <nav className="flex flex-col gap-4 text-lg font-medium">
                    <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="border-b pb-2">Shop</Link>
                    <Link to="/on-sale" onClick={() => setIsMenuOpen(false)} className="border-b pb-2">On Sale</Link>
                    <button onClick={handleScrollToNewArrivals} className="text-left border-b pb-2 font-medium">New Arrivals</button>
                    <Link to="/brands" onClick={() => setIsMenuOpen(false)} className="border-b pb-2">Brands</Link>
                </nav>

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