import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminCustomersPage = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/customers`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setCustomers(res.data))
        .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-black mb-6">Active Customers</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map(user => (
                    <div key={user.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{user.name}</h3>
                            <p className="text-gray-500 text-sm">{user.email}</p>
                            <div className="mt-2 text-xs bg-gray-100 px-2 py-1 rounded w-fit">
                                Total Orders: <span className="font-bold">{user.orders_count}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCustomersPage;