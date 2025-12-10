import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiDollarSign, FiShoppingBag, FiUsers, FiBox } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        total_revenue: 0,
        total_orders: 0,
        total_users: 0,
        total_products: 0
    });
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
      // 1. Ambil token dari localStorage (sesuaikan nama key-nya, misal 'token')
        const token = localStorage.getItem('token'); 

      // 2. Masukkan token ke dalam headers
        axios.get(`${apiUrl}/admin/stats`, {
            headers: {
              Authorization: `Bearer ${token}` // Wajib ada spasi setelah Bearer
            }
        })
        .then(res => {
            setStats(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
            
          // Opsional: Jika token expired/invalid (401), lempar balik ke login
            if (err.response && err.response.status === 401) {
             // window.location.href = '/login'; 
            }
        });
    }, [apiUrl]);

    if (loading) return <div className="p-10 font-bold text-gray-500">Loading Dashboard...</div>;

    return (
    <div>
        <h1 className="text-3xl font-black uppercase mb-8 font-sans tracking-tight">Overview</h1>

        {/* Grid Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                label="Total Revenue" 
                value={`$${parseInt(stats.total_revenue).toLocaleString()}`} 
                icon={<FiDollarSign />} 
                color="bg-black text-white"
            />
            <Link to="/admin/orders">
                <StatCard 
                    label="Total Orders" 
                    value={stats.total_orders} 
                    icon={<FiShoppingBag />} 
                    color="bg-white text-black border border-gray-200 hover:bg-gray-50 cursor-pointer"
            />
            </Link>
            {/* Kartu Customers -> Link ke /admin/customers */}
            <Link to="/admin/customers">
                <StatCard 
                    label="Active Customers" 
                    value={stats.total_users} 
                    icon={<FiUsers />} 
                    color="bg-white text-black border border-gray-200 hover:bg-gray-50 cursor-pointer"
            />
            </Link>
            {/* Kartu Products -> Link ke /admin/products (Asumsi page ini sudah ada) */}
            <Link to="/admin/products">
                <StatCard 
                    label="Total Products" 
                value={stats.total_products} 
                icon={<FiBox />} 
                color="bg-white text-black border border-gray-200 hover:bg-gray-50 cursor-pointer"
            />
            </Link>
        </div>
        
        <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-8 h-64 flex items-center justify-center text-gray-400 font-bold">
            Analytics Chart Coming Soon 📈
        </div>
    </div>
);
};

const StatCard = ({ label, value, icon, color }) => (
    <div className={`${color} p-6 rounded-2xl shadow-sm flex items-center gap-4 transition hover:-translate-y-1`}>
        <div className="p-3 bg-gray-100/20 rounded-full text-2xl">
            {icon}
        </div>
        <div>
            <p className="text-xs font-bold uppercase opacity-70 mb-1">{label}</p>
            <p className="text-2xl font-black">{value}</p>
        </div>
    </div>
);

export default DashboardPage;