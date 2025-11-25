import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
const [products, setProducts] = useState([]);

  // Mengambil data dari Backend saat halaman dibuka
useEffect(() => {
    // Pastikan Laravel sudah jalan di port 8000
    axios.get('http://127.0.0.1:8000/api/products?limit=4')
    .then(res => {
        setProducts(res.data);
    })
    .catch(err => console.error("Gagal ambil data:", err));
}, []);

return (
    <div className="pb-20">
      {/* 1. HERO SECTION (Banner Utama) */}
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
        
        {/* Gambar Hero (Placeholder Sementara) */}
        <div className="md:w-1/2 relative flex justify-center items-end h-full">
            <img 
            src="https://placehold.co/600x600/png?text=Model+Fashion" 
            alt="Fashion Models" 
            className="object-cover h-[400px] md:h-[600px] w-full mix-blend-multiply" 
            />
            {/* Hiasan Bintang (Star) */}
            <span className="absolute top-10 right-10 text-4xl">✦</span>
            <span className="absolute top-1/2 left-10 text-2xl">✦</span>
        </div>
    </header>

      {/* 2. BRAND BANNER (Hitam) */}
    <div className="bg-black py-8 flex flex-wrap justify-center gap-8 md:gap-16 px-4">
        <span className="text-white text-2xl font-serif">VERSACE</span>
        <span className="text-white text-2xl font-serif">ZARA</span>
        <span className="text-white text-2xl font-serif">GUCCI</span>
        <span className="text-white text-2xl font-serif">PRADA</span>
        <span className="text-white text-2xl font-serif">Calvin Klein</span>
    </div>

      {/* 3. NEW ARRIVALS (Data dari Laravel) */}
    <section className="px-6 md:px-10 py-16 text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-12 uppercase font-sans">New Arrivals</h2>
        
        {/* Grid Produk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(product => (
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

        <div className="mt-10">
            <button className="border border-gray-300 px-16 py-3 rounded-full font-medium hover:bg-black hover:text-white transition">
                View All
            </button>
        </div>
    </section>
    </div>
);
};

export default Home;