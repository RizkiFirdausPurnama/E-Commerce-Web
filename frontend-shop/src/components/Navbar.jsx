import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
const { cartCount } = useContext(CartContext);
const [isMenuOpen, setIsMenuOpen] = useState(false);

const navigate = useNavigate();
const location = useLocation();

const handleScrollToNewArrivals = () => {
    if (location.pathname === '/') {
        // Jika sedang di Home, langsung scroll
        const element = document.getElementById('new-arrivals');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // Jika di halaman lain, pindah ke Home sambil bawa pesan "tolong scroll"
        navigate('/', { state: { scrollTo: 'new-arrivals' } });
    }
};

return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div className="flex items-center justify-between px-6 md:px-10 py-6">
        {/* Logo & Mobile Menu Button */}
        <div className="flex items-center gap-4">
        <FiMenu className="md:hidden text-2xl cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />
        <Link to="/" className="text-3xl font-black tracking-tighter uppercase font-sans">SHOP.CO</Link>
        </div>
        
        {/* Menu Desktop */}
        <div className="hidden md:flex items-center space-x-6 text-base font-medium">
        <Link to="/" className="hover:underline">Shop</Link>
        <Link to="/" className="hover:underline">On Sale</Link>
        <button 
            onClick={handleScrollToNewArrivals} 
            className="hover:underline font-medium"
        >
            New Arrivals
        </button>
        <Link to="/" className="hover:underline">Brands</Link>
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

        {/* Icons Kanan */}
        <div className="flex items-center space-x-4">
        <Link to="/cart" className="relative">
            <FiShoppingCart className="text-2xl cursor-pointer hover:text-gray-600 transition" />
            {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {cartCount}
            </span>
            )}
        </Link>
        <FiUser className="text-2xl cursor-pointer hover:text-gray-600 transition" />
        </div>
    </div>
    </nav>
);
};

export default Navbar;