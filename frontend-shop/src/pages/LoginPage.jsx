import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import Context
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Ambil fungsi login dari AuthContext
    const { login } = useContext(AuthContext);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Panggil fungsi login dari Context
        // Fungsi ini akan otomatis request ke API Laravel
        const success = await login(email, password);
        
        if (success) {
            toast.success("Login Berhasil! Selamat berbelanja.");
            navigate('/'); // Balik ke Home setelah login
        } else {
            toast.error("Login Gagal! Email atau Password salah.");
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh] px-4 bg-gray-50">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-3xl font-black mb-6 text-center uppercase font-sans">Login</h2>
                
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-sm">Email Address</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={e=>setEmail(e.target.value)} 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black" 
                        placeholder="john@example.com"
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-bold text-sm">Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e=>setPassword(e.target.value)} 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black" 
                        placeholder="••••••••"
                        required 
                    />
                </div>

                <button className="w-full bg-black text-white py-3 rounded-full font-bold hover:bg-gray-800 transition">
                    Sign In
                </button>
                
                <p className="mt-6 text-center text-sm text-gray-500">
                    Belum punya akun? <Link to="/register" className="text-black font-bold hover:underline">Daftar Sekarang</Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;