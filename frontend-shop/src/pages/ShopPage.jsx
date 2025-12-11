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
        axios.get(endpoint) // Perbaikan: Gunakan variabel endpoint yang sudah dibuat
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [apiUrl, searchQuery]);

    // --- FUNGSI PINTAR: PERBAIKI LINK GAMBAR ---
    const getImageUrl = (path) => {
        if (!path) return 'https://placehold.co/300';
        if (path.startsWith('http')) return path; 
        const baseUrl = apiUrl.replace('/api', '');
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${baseUrl}${cleanPath}`;
    };

    return (
        <div className="px-6 md:px-10 py-10 max-w-7xl mx-auto min-h-screen">
            <h1 className="text-4xl font-black uppercase mb-8 font-sans">Shop All Products</h1>
            {loading ? (
            <div className="text-center py-20">Loading...</div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map(product => (
                <ProductCard key={product.id} product={product} getImageUrl={getImageUrl} />
            ))}
            </div>
        )}
        </div>
    );
};

// Kita buat komponen kecil biar kodenya rapi & bisa dipakai ulang
// Tambahkan prop getImageUrl agar bisa dipakai di dalam card
export const ProductCard = ({ product, getImageUrl }) => {
    return (
        <Link to={`/product/${product.slug}`} className="group cursor-pointer">
        {/* Gambar */}
        <div className="bg-[#F0EEED] rounded-2xl aspect-square mb-4 overflow-hidden relative">
            {/* GUNAKAN getImageUrl DISINI */}
            <img 
                src={getImageUrl(product.images[0]?.image_url)} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
            />
        </div>
        {/* Nama Produk */}
        <h3 className="font-bold text-lg truncate font-sans uppercase">{product.name}</h3>
        
        {/* Rating */}
        <div className="flex items-center space-x-2 text-sm my-1">
            <span className="text-yellow-400">★★★★☆</span>
            <span className="text-gray-500">{product.rating}/5</span>
        </div>
        
        {/* --- BAGIAN HARGA --- */}
        <div className="flex items-center space-x-3 mt-1">
            <span className="font-bold text-xl">${product.base_price}</span>
            {product.discount_percentage > 0 && (
                <>
                    <span className="text-gray-400 line-through font-bold text-lg">
                        ${(product.base_price * (100 + product.discount_percentage) / 100).toFixed(0)}
                    </span>
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                        -{product.discount_percentage}%
                    </span>
                </>
            )}
        </div>
        </Link>
    );
};

export default ShopPage;