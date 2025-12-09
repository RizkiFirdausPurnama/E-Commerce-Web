import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// Kita import toast untuk jaga-jaga kalau ada error fetch
import toast from 'react-hot-toast';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Panggil API (Token otomatis terkirim oleh setup axios sebelumnya)
    axios.get(`${apiUrl}/orders`)
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal mengambil riwayat pesanan:", err);
        toast.error("Gagal memuat riwayat pesanan.");
        setLoading(false);
      });
  }, [apiUrl]);

  // Tampilan Loading
  if (loading) {
      return (
          <div className="flex justify-center items-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
      );
  }

  // Tampilan Jika Belum Ada Pesanan
  if (orders.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <span className="text-6xl mb-4">📦</span>
            <h2 className="text-2xl font-black uppercase mb-2 font-sans">No orders yet</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
            <Link to="/shop" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition">
                Start Shopping
            </Link>
        </div>
    );
  }

  // Tampilan Utama Riwayat Pesanan
  return (
    <div className="px-6 md:px-10 py-10 max-w-5xl mx-auto min-h-screen font-sans">
      <h1 className="text-3xl md:text-4xl font-black uppercase mb-10">My Orders</h1>

      <div className="space-y-8">
        {orders.map(order => (
            // KARTU PESANAN (Per Order ID)
            <div key={order.id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                
                {/* HEADER PESANAN (Abu-abu) */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-10">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Order Number</p>
                            <p className="font-mono font-bold text-sm md:text-base">{order.order_number}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Date Placed</p>
                            {/* Format tanggal sederhana */}
                            <p className="font-medium text-sm">
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Amount</p>
                            <p className="font-black text-lg">${order.total_price}</p>
                        </div>
                        {/* Badge Status */}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                            ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* DAFTAR BARANG YANG DIBELI */}
                <div className="p-6 space-y-6">
                    {order.items.map(item => {
                        // --- PENGAMBILAN GAMBAR YANG AMAN ---
                        // Kita ambil gambar pertama dari array images produk tersebut.
                        // Menggunakan optional chaining (?.) agar tidak error jika datanya kosong.
                        const imageUrl = item.product_variant?.product?.images?.[0]?.image_url;
                        
                        // Placeholder jika gambar tidak ditemukan
                        const finalImage = imageUrl || "https://placehold.co/200x200/e0e0e0/999999?text=No+Image";

                        return (
                        <div key={item.id} className="flex items-start md:items-center gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                            {/* === BAGIAN GAMBAR PRODUK === */}
                            <Link to={`/product/${item.product_variant?.product?.slug}`} className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                                <img 
                                    src={finalImage}
                                    alt={item.product_variant?.product?.name || "Product Image"}
                                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                                />
                            </Link>

                            {/* Detail Info Produk */}
                            <div className="flex-1">
                                <Link to={`/product/${item.product_variant?.product?.slug}`}>
                                    <h4 className="font-bold text-lg hover:underline truncate">{item.product_variant?.product?.name}</h4>
                                </Link>
                                <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
                                    <span className="bg-gray-100 px-2 py-1 rounded-md font-medium">
                                        Size: <span className="text-black">{item.product_variant?.size}</span>
                                    </span>
                                    <span className="bg-gray-100 px-2 py-1 rounded-md font-medium flex items-center gap-1">
                                        Color: 
                                        <span className="w-3 h-3 rounded-full inline-block border border-gray-300" style={{backgroundColor: item.product_variant?.color_hex}}></span>
                                        <span className="text-black">{item.product_variant?.color_name}</span>
                                    </span>
                                    <span className="bg-gray-100 px-2 py-1 rounded-md font-medium">
                                        Qty: <span className="text-black">{item.quantity}</span>
                                    </span>
                                </div>
                            </div>
                            
                            {/* Harga Per Item (Opsional) */}
                             <div className="hidden md:block text-right">
                                <p className="font-bold text-lg">${item.price}</p>
                            </div>

                        </div>
                    )})}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;