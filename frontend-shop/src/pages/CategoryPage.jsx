import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CategoryPage = () => {
  const { categoryName } = useParams(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil URL API dari env
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // --- FUNGSI PENTING: Perbaiki URL Gambar ---
  const getImageUrl = (path) => {
      // 1. Kalau path kosong, pakai gambar placeholder
      if (!path) return 'https://placehold.co/300?text=No+Image';
      
      // 2. Kalau path sudah http/https (link luar), biarkan saja
      if (path.startsWith('http')) return path; 

      // 3. LOGIKA UTAMA: Gabungkan Base URL Backend dengan Path Gambar
      // Kita ambil root url backend (contoh: http://127.0.0.1:8000)
      // Caranya: Hapus '/api' dari apiUrl
      const baseUrl = apiUrl.replace('/api', '');

      // Pastikan path dimulai dengan garis miring '/'
      const cleanPath = path.startsWith('/') ? path : `/${path}`;

      // Hasil Akhir: http://127.0.0.1:8000/storage/products/namafile.jpg
      return `${baseUrl}${cleanPath}`;
  };

  useEffect(() => {
    setLoading(true);
    setProducts([]);

    if (categoryName) {
        axios.get(`${apiUrl}/products?category=${categoryName}`)
        .then(res => {
            setProducts(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Gagal ambil data kategori:", err);
            setLoading(false);
        });
    }
  }, [categoryName]);

  const capitalize = (text) => {
    if(!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
      {/* Header Kategori */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase font-sans">
            {categoryName ? capitalize(categoryName.replace('-', ' ')) : 'Category'} Collection
        </h1>
        <span className="text-gray-500 text-sm">
            Showing {products.length} Products
        </span>
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold">Loading Products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <h2 className="text-xl font-bold mb-2">No Products Found</h2>
          <p className="text-gray-500">
            Sorry, we don't have products for "{categoryName}".
          </p>
          <Link to="/" className="text-black font-bold underline mt-4 inline-block">Back to Home</Link>
        </div>
      ) : (
        /* Grid Produk */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link to={`/product/${product.slug}`} key={product.id} className="text-left group cursor-pointer">
              <div className="bg-[#F0EEED] rounded-2xl aspect-square mb-4 overflow-hidden relative">
                
                {/* GAMBAR DISINI: Pakai fungsi getImageUrl yang baru */}
                <img 
                  src={getImageUrl(product.images[0]?.image_url)} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                  onError={(e) => { e.target.src = 'https://placehold.co/300?text=Error'; }} // Fallback kalau masih error
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
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;