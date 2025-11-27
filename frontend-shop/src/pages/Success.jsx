import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const Success = () => {
const location = useLocation();
  // Ambil data orderNumber yang dikirim dari halaman Cart
const orderNumber = location.state?.orderNumber || "Unknown";

return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <FiCheckCircle className="text-green-500 text-8xl mb-6" />
    <h1 className="text-4xl font-black uppercase font-sans mb-2">Order Successful!</h1>
    <p className="text-gray-500 mb-6">Thank you for your purchase.</p>

    <div className="bg-gray-100 p-6 rounded-xl mb-8">
        <p className="text-sm text-gray-500 uppercase">Your Order ID</p>
        <p className="text-3xl font-bold tracking-widest">{orderNumber}</p>
    </div>

    <Link to="/" className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
        Continue Shopping
    </Link>
    </div>
);
};

export default Success;