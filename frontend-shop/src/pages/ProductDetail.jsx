import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State pilihan user
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);

  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // --- HANYA INI TAMBAHAN DARI SAYA (Supaya Gambar Muncul) ---
  const getImageUrl = (path) => {
      if (!path) return 'https://placehold.co/400?text=No+Image';
      if (path.startsWith('http')) return path; 
      
      const baseUrl = apiUrl.replace('/api', '');
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      
      return `${baseUrl}${cleanPath}`;
  };
  // -----------------------------------------------------------

  // Ambil data produk
  useEffect(() => {
    axios.get(`${apiUrl}/products/${slug}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [slug, apiUrl]);

  if (loading) return <div className="text-center py-20 font-bold">Loading Product...</div>;
  if (!product) return <div className="text-center py-20 font-bold text-red-500">Product Not Found</div>;

  const uniqueColors = [...new Set(product.variants.map(v => v.color_hex))];
  const uniqueSizes = [...new Set(product.variants.map(v => v.size))];

  // --- LOGIC ASLI KAMU (TIDAK SAYA UBAH SAMA SEKALI) ---
  const handleAddToCart = () => {
     // --- BAGIAN PROTEKSI LOGIN (SATPAM) ---
    if (!user) {
        toast.error("Eits! Anda harus Login dulu sebelum belanja.");
         navigate('/login'); // Tendang ke halaman Login
         return; // Stop, jangan lanjut ke bawah
    }
     // -------------------------------------

     // Validasi pilihan
    if (!selectedColor || !selectedSize) {
        toast.error("Please select Color and Size first!");
        return;
    }

    const variant = product.variants.find(v => v.color_hex === selectedColor && v.size === selectedSize);
    
    if(variant) {
        addToCart(variant.id, qty);
        toast.success(`Berhasil! ${qty} item masuk keranjang.`);
    } else {
        toast.error("Stok varian ini habis.");
    }
  };

  return (
    <div className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        
        {/* GAMBAR (SAYA PASANG getImageUrl DISINI SAJA) */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-4 overflow-x-auto">
                {product.images.map((img, idx) => (
                    <img 
                        key={idx} 
                        src={getImageUrl(img.image_url)} // Pakai Helper Image
                        className="w-20 h-20 md:w-32 md:h-32 object-cover rounded-xl border border-transparent hover:border-black cursor-pointer bg-gray-100" 
                        alt="thumb"
                    />
                ))}
            </div>
            <div className="flex-1 bg-[#F0EEED] rounded-2xl overflow-hidden">
                <img 
                    src={getImageUrl(product.images[0]?.image_url)} // Pakai Helper Image
                    className="w-full h-full object-cover" 
                    alt="Main Product" 
                />
            </div>
        </div>

        {/* INFO PRODUK */}
        <div>
          <h1 className="text-4xl font-black uppercase mb-2 font-sans">{product.name}</h1>
          <div className="flex items-center mb-4 text-yellow-400 space-x-2">
            <span>{'★'.repeat(Math.round(product.rating))} {'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span className="text-black text-sm">{product.rating}/5</span>
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold">${product.base_price}</span>
              {product.discount_percentage > 0 && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">-{product.discount_percentage}%</span>
              )}
          </div>
          
          <p className="text-gray-500 mb-6 leading-relaxed border-b border-gray-200 pb-6">
            {product.description}
          </p>
          
          {/* PILIHAN WARNA */}
          <div className="mb-6">
              <p className="text-gray-500 mb-3 text-sm">Select Colors</p>
              <div className="flex space-x-3">
                  {uniqueColors.map((colorHex, idx) => (
                      <button 
                          key={idx} 
                          onClick={() => setSelectedColor(colorHex)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center border transition ${selectedColor === colorHex ? 'border-2 border-black ring-1 ring-black' : 'border-gray-300'}`} 
                          style={{backgroundColor: colorHex}}
                      >
                        {selectedColor === colorHex && <FiCheck className={colorHex === '#FFFFFF' ? 'text-black' : 'text-white'} />}
                      </button>
                  ))}
              </div>
          </div>

          {/* PILIHAN SIZE */}
          <div className="mb-8 border-b border-gray-200 pb-8">
              <p className="text-gray-500 mb-3 text-sm">Choose Size</p>
              <div className="flex flex-wrap gap-3">
                  {uniqueSizes.map((size, idx) => (
                      <button 
                          key={idx}
                          onClick={() => setSelectedSize(size)} 
                          className={`px-6 py-3 rounded-full text-sm font-medium transition ${selectedSize === size ? 'bg-black text-white' : 'bg-[#F0F0F0] text-gray-600 hover:bg-gray-200'}`}
                      >
                          {size}
                      </button>
                  ))}
              </div>
          </div>

          {/* TOMBOL AKSI */}
          <div className="flex space-x-4">
              <div className="flex items-center bg-[#F0F0F0] rounded-full px-5 py-3 space-x-5">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}><FiMinus/></button>
                  <span className="font-bold text-lg">{qty}</span>
                  <button onClick={() => setQty(qty + 1)}><FiPlus/></button>
              </div>
              <button 
                onClick={handleAddToCart} 
                className="flex-1 bg-black text-white rounded-full py-3 font-medium hover:bg-gray-800 transition text-lg"
              >
                  Add to Cart
              </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;