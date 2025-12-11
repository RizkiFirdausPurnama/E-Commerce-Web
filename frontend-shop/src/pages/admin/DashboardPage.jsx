import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiBox, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';

const DashboardPage = () => {
    // State untuk menyimpan data statistik
    const [stats, setStats] = useState({
        total_revenue: 0,
        total_orders: 0,
        total_users: 0,
        total_products: 0 // Default 0
    });
    
    const [loading, setLoading] = useState(true);

    // Ambil data statistik dari Backend
    useEffect(() => {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_BASE_URL;

        axios.get(`${apiUrl}/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setStats(res.data); // Simpan data asli dari database
            setLoading(false);
        })
        .catch(err => {
            console.error("Gagal ambil stats:", err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-10 font-bold text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter">Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                
                {/* 1. KARTU TOTAL REVENUE */}
                <div className="bg-black text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gray-800 rounded-full">
                            <FiDollarSign size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase">Total Revenue</span>
                    </div>
                    <h3 className="text-3xl font-black">${stats.total_revenue.toLocaleString()}</h3>
                </div>

                {/* 2. KARTU TOTAL ORDERS (Link ke Halaman Orders) */}
                <Link to="/admin/orders" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gray-100 rounded-full group-hover:bg-black group-hover:text-white transition">
                            <FiShoppingBag size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase">Total Orders</span>
                    </div>
                    <h3 className="text-3xl font-black">{stats.total_orders}</h3>
                </Link>

                {/* 3. KARTU ACTIVE CUSTOMERS (Link ke Halaman Customers) */}
                <Link to="/admin/customers" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gray-100 rounded-full group-hover:bg-black group-hover:text-white transition">
                            <FiUsers size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase">Active Customers</span>
                    </div>
                    <h3 className="text-3xl font-black">{stats.total_users}</h3>
                </Link>

                {/* 4. KARTU TOTAL PRODUCTS (YANG TADI SALAH) */}
                <Link to="/admin/products" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gray-100 rounded-full group-hover:bg-black group-hover:text-white transition">
                            <FiBox size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase">Total Products</span>
                    </div>
                    
                    {/* PERBAIKAN DISINI: Gunakan variabel stats, bukan angka mati */}
                    <h3 className="text-3xl font-black">{stats.total_products}</h3> 
                </Link>

            </div>
        </div>
    );
};

export default DashboardPage;