import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
const [products, setProducts] = useState([]);
const [visibleProducts, setVisibleProducts] = useState(4); 

const location = useLocation();

useEffect(() => {
    if (location.state && location.state.scrollTo) {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}, [location]);

useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products')
    .then(res => {
        setProducts(res.data);
    })
    .catch(err => console.error("Gagal ambil data:", err));
}, []);

  // --- LOGIKA BARU (TOGGLE) ---
const handleToggleProducts = () => {
    if (visibleProducts < products.length) {
        // Jika belum tampil semua -> Tampilkan Semua
        setVisibleProducts(products.length);
    } else {
        // Jika sudah tampil semua -> Balikkan jadi 4
        setVisibleProducts(4);
        
        // Opsional: Scroll sedikit ke atas agar user tidak bingung
        // document.getElementById('new-arrivals').scrollIntoView({ behavior: 'smooth' });
    }
};

return (
    <div className="pb-20">
      {/* 1. HERO SECTION (SAMA) */}
    <header className="bg-[#F2F0F1] pt-10 md:pt-20 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between overflow-hidden">
        <div className="md:w-1/2 space-y-6 z-10 pb-10">
        <h1 className="text-4xl md:text-6xl font-black leading-tight font-sans uppercase">
            Find Clothes<br/>That Matches<br/>Your Style
        </h1>
        <p className="text-gray-500 text-sm md:text-lg max-w-md">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality.
        </p>
        <button className="bg-black text-white px-10 md:px-16 py-4 rounded-full text-lg mt-4 hover:bg-gray-800 transition">
            Shop Now
        </button>
        
        <div className="flex space-x-6 md:space-x-8 mt-8">
            <div><h3 className="text-2xl font-bold">200+</h3><p className="text-xs text-gray-500">Intl Brands</p></div>
            <div><h3 className="text-2xl font-bold">2,000+</h3><p className="text-xs text-gray-500">Quality Products</p></div>
            <div><h3 className="text-2xl font-bold">30,000+</h3><p className="text-xs text-gray-500">Happy Customers</p></div>
        </div>
        </div>
        
        <div className="md:w-1/2 relative flex justify-center items-end h-full">
            <img 
            src="https://i.pinimg.com/736x/18/a6/86/18a6862710797a4e426842e7fa38c1a3.jpg" 
            alt="Fashion Models" 
            className="object-cover h-[400px] md:h-[600px] w-full mix-blend-multiply" 
            />
            <span className="absolute top-10 right-10 text-4xl">✦</span>
            <span className="absolute top-1/2 left-10 text-2xl">✦</span>
        </div>
    </header>

      {/* 2. BRAND BANNER (SAMA) */}
    <div className="bg-black py-8 flex flex-wrap justify-center gap-8 md:gap-16 px-4">
        <span className="text-white text-2xl font-serif">VERSACE</span>
        <span className="text-white text-2xl font-serif">ZARA</span>
        <span className="text-white text-2xl font-serif">GUCCI</span>
        <span className="text-white text-2xl font-serif">PRADA</span>
        <span className="text-white text-2xl font-serif">Calvin Klein</span>
    </div>

      {/* 3. NEW ARRIVALS */}
    <section id="new-arrivals" className="px-6 md:px-10 py-16 text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-12 uppercase font-sans">New Arrivals</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-500">
        {products.slice(0, visibleProducts).map(product => (
            <Link to={`/product/${product.slug}`} key={product.id} className="text-left group cursor-pointer">
            <div className="bg-[#F0EEED] rounded-2xl aspect-square mb-4 overflow-hidden relative">
                <img 
                    src={product.images[0]?.image_url || 'https://placehold.co/300'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                />
            </div>
            <h3 className="font-bold text-lg truncate">{product.name}</h3>
            <div className="flex items-center space-x-2 text-sm my-1">
                <div className="text-yellow-400">
                    {'★'.repeat(Math.round(product.rating))}
                    {'☆'.repeat(5 - Math.round(product.rating))}
                </div>
                <span className="text-gray-500">{product.rating}/5</span>
            </div>
            <div className="flex items-center space-x-3 mt-1">
                <span className="font-bold text-xl">${product.base_price}</span>
                {product.discount_percentage > 0 && (
                    <>
                        <span className="text-gray-400 line-through font-bold">${(product.base_price * (100 + product.discount_percentage) / 100).toFixed(0)}</span>
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">-{product.discount_percentage}%</span>
                    </>
                )}
            </div>
            </Link>
        ))}
        </div>

        {/* LOGIKA TOMBOL BARU */}
        {products.length > 4 && (
            <div className="mt-10">
                <button 
                    onClick={handleToggleProducts}
                    className="border border-gray-300 px-16 py-3 rounded-full font-medium hover:bg-black hover:text-white transition cursor-pointer"
                >
                    {/* Ubah Teks Tombol: View All <-> Show Less */}
                    {visibleProducts < products.length ? 'View All' : 'Show Less'}
                </button>
            </div>
        )}
    </section>

      {/* 4. BROWSE BY CATEGORY (SAMA) */}
    <section className="px-6 md:px-10 py-10">
        <div className="bg-[#F0F0F0] rounded-[40px] px-6 md:px-16 py-10 md:py-16">
            <h2 className="text-3xl md:text-5xl font-black text-center mb-10 md:mb-16 uppercase font-sans">
                BROWSE BY CATEGORY
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/category/men" className="bg-white h-[250px] md:h-[350px] rounded-[20px] p-6 relative overflow-hidden group cursor-pointer">
                    <h3 className="text-3xl font-black z-10 relative text-white">Men</h3>
                    <img 
                        src="https://i.pinimg.com/736x/87/65/ea/8765ea6af8697e060ed5fcdb6aa1bb0e.jpg" 
                        className="absolute right-0 top-0 h-full w-full object-cover group-hover:scale-110 transition duration-500" 
                        alt="Pria" 
                    />
                </Link>

                <Link to="/category/women" className="bg-white h-[250px] md:h-[350px] rounded-[20px] p-6 relative overflow-hidden group cursor-pointer">
                    <h3 className="text-3xl font-black z-10 relative">Women</h3>
                    <img 
                        src="https://i.pinimg.com/1200x/cc/e2/fb/cce2fba8f2e5b5d2c954f36ab508ae4e.jpg" 
                        className="absolute right-0 top-0 h-full w-full object-cover group-hover:scale-110 transition duration-500" 
                        alt="Wanita" 
                    />
                </Link>

                <Link to="/category/kids" className="bg-white h-[250px] md:h-[350px] rounded-[20px] p-6 relative overflow-hidden group cursor-pointer">
                    <h3 className="text-3xl font-black z-10 relative text-white">Kids</h3>
                    <img 
                        src="https://i.pinimg.com/1200x/6a/de/05/6ade052ed92399c11969724e539fb854.jpg" 
                        className="absolute right-0 top-0 h-full w-full object-cover group-hover:scale-110 transition duration-500" 
                        alt="Anak-anak" 
                    />
                </Link>
            </div>
        </div>
    </section>

    </div>
);
};

export default Home;