import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiChevronDown, FiChevronUp, FiBox, FiUser, FiCalendar } from 'react-icons/fi';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/orders`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setOrders(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-10 font-bold text-gray-500">Loading Orders Data...</div>;

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter">Order Management</h1>
            
            <div className="space-y-4">
                {orders.map(order => (
                    <OrderRow key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
};

// Component Terpisah untuk Baris Order
const OrderRow = ({ order }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // --- FUNGSI PINTAR: PERBAIKI LINK GAMBAR (Di Admin juga butuh ini) ---
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    
    const getImageUrl = (path) => {
        if (!path) return 'https://placehold.co/300';
        if (path.startsWith('http')) return path; 
        
        // Hapus '/api' untuk dapat root URL (http://127.0.0.1:8000)
        const baseUrl = apiUrl.replace('/api', '');
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        
        return `${baseUrl}${cleanPath}`;
    };
    // ---------------------------------------------------------------------

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all">
            {/* HEADER BARIS (Selalu Muncul) */}
            <div 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition"
            >
                {/* Info Kiri: ID & User */}
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-full">
                        <FiBox className="text-xl"/>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg font-mono text-gray-800">
                            #{order.order_number || `ORD-${order.id}`}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <FiUser size={14}/> <span>{order.user ? order.user.name : 'Guest/Deleted User'}</span>
                            <span className="text-gray-300">|</span>
                            <FiCalendar size={14}/> <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Info Kanan: Status, Harga, Arrow */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                        <p className="font-bold text-lg">${parseInt(order.total_price).toLocaleString()}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mt-1
                            ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {order.status}
                        </span>
                    </div>
                    
                    <button className="text-gray-400">
                        {isOpen ? <FiChevronUp size={24}/> : <FiChevronDown size={24}/>}
                    </button>
                </div>
            </div>

            {/* DETAIL PRODUK (Muncul Jika isOpen === true) */}
            {isOpen && (
                <div className="bg-gray-50 border-t border-gray-100 p-6 animate-fadeIn">
                    <h4 className="font-bold text-sm text-gray-500 uppercase mb-4">Product Details</h4>
                    
                    <div className="grid grid-cols-1 gap-4">
                        {order.items.map((item, index) => {
                            const variant = item.product_variant;
                            const product = variant?.product;

                            return (
                                <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
                                    {/* Gambar Produk */}
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                        {/* GUNAKAN getImageUrl DISINI */}
                                        <img 
                                            src={getImageUrl(product?.images?.[0]?.image_url)} 
                                            alt={product?.name || "Product"}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = 'https://placehold.co/300?text=No+Img'; }}
                                        />
                                    </div>

                                    {/* Info Produk */}
                                    <div className="flex-1">
                                        <h5 className="font-bold text-gray-800">{product?.name || 'Unknown Product'}</h5>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Size: <span className="font-medium text-black">{variant?.size || '-'}</span> 
                                            <span className="mx-2">•</span> 
                                            Color: <span className="font-medium text-black">{variant?.color_name || '-'}</span>
                                        </p>
                                    </div>

                                    {/* Qty & Harga */}
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Qty: <span className="font-bold text-black">{item.quantity}</span></p>
                                        <p className="font-bold text-black mt-1">
                                            ${parseInt(item.price).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                        <span>Shipping Address: Default Address</span>
                        <span className="font-bold text-black">Total Paid: ${parseInt(order.total_price).toLocaleString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersPage;