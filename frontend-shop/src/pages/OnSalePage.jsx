import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductCard } from './ShopPage'; // Kita import kartu dari ShopPage biar hemat kode

const OnSalePage = () => {
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const apiUrl = import.meta.env.VITE_API_BASE_URL;

useEffect(() => {
    axios.get(`${apiUrl}/products`)
    .then(res => {
        // FILTER: Hanya ambil yang discount_percentage > 0
        const saleItems = res.data.filter(item => item.discount_percentage > 0);
        setProducts(saleItems);
        setLoading(false);
    })
    .catch(err => {
        console.error(err);
        setLoading(false);
    });
}, [apiUrl]);

return (
    <div className="px-6 md:px-10 py-10 max-w-7xl mx-auto min-h-screen">
    <div className="mb-8">
        <h1 className="text-4xl font-black uppercase font-sans text-red-600">Flash Sale </h1>
        <p className="text-gray-500 mt-2">Grab these items before they are gone!</p>
    </div>
    
    {loading ? (
        <div className="text-center py-20">Loading...</div>
    ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No items on sale right now.</div>
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

export default OnSalePage;