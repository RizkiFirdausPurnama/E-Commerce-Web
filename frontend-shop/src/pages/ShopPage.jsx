import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // 2. Ambil parameter search dari URL
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');
useEffect(() => {
    setLoading(true);
    
    // 3. Tentukan Endpoint (Apakah mode Search atau mode Semua Produk)
    let endpoint = `${apiUrl}/products`;
    
    if (searchQuery) {
        endpoint += `?search=${searchQuery}`; // Tambahkan query search
    }
    // Ambil semua produk
    axios.get(`${apiUrl}/products`)
        .then(res => {
        setProducts(res.data);
        setLoading(false);
    })
        .catch(err => {
        console.error(err);
        setLoading(false);
    });
}, [apiUrl, searchQuery]);

return (
    <div className="px-6 md:px-10 py-10 max-w-7xl mx-auto min-h-screen">
        <h1 className="text-4xl font-black uppercase mb-8 font-sans">Shop All Products</h1>
        {loading ? (
        <div className="text-center py-20">Loading...</div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(product => (
            <ProductCard key={product.id} product={product} />
        ))}
        </div>
    )}
    </div>
);
};

// Kita buat komponen kecil biar kodenya rapi & bisa dipakai ulang
export const ProductCard = ({ product }) => (
<Link to={`/product/${product.slug}`} className="group cursor-pointer">
    <div className="bg-[#F0EEED] rounded-2xl aspect-square mb-4 overflow-hidden relative">
        <img 
        src={product.images[0]?.image_url} 
        alt={product.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
        />
    </div>
    <h3 className="font-bold text-lg truncate">{product.name}</h3>
    <div className="flex items-center space-x-2 text-sm my-1">
        <span className="text-yellow-400">★★★★☆</span>
        <span className="text-gray-500">{product.rating}/5</span>
    </div>
    <div className="flex items-center space-x-3 mt-1">
        <span className="font-bold text-xl">${product.base_price}</span>
        {product.discount_percentage > 0 && (
        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">-{product.discount_percentage}%</span>
        )}
    </div>
</Link>
);

export default ShopPage;