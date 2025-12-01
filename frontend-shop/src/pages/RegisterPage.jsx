import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    // Ambil URL dari Environment Variable
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Panggil API Register Laravel
            await axios.post(`${apiUrl}/register`, {
                name,
                email,
                password
            });
            
            alert("Registrasi Berhasil! Silakan Login.");
            navigate('/login'); // Arahkan ke halaman login
            
        } catch (error) {
            console.error(error);
            // Cek jika error validasi (misal email sudah ada)
            if (error.response && error.response.data.message) {
                alert("Gagal: " + error.response.data.message);
            } else {
                alert("Registrasi Gagal.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh] px-4">
            <form onSubmit={handleRegister} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-3xl font-black mb-6 text-center">REGISTER</h2>
                
                <div className="mb-4">
                    <label className="block mb-2 font-bold">Full Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={e=>setName(e.target.value)} 
                        className="w-full border p-3 rounded-lg" 
                        placeholder="John Doe"
                        required 
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-bold">Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={e=>setEmail(e.target.value)} 
                        className="w-full border p-3 rounded-lg" 
                        placeholder="john@example.com"
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-bold">Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e=>setPassword(e.target.value)} 
                        className="w-full border p-3 rounded-lg" 
                        placeholder="Minimum 8 characters"
                        required 
                    />
                </div>

                <button className="w-full bg-black text-white py-3 rounded-full font-bold hover:bg-gray-800 transition">
                    Create Account
                </button>
                
                <p className="mt-4 text-center">
                    Sudah punya akun? <Link to="/login" className="text-blue-500 font-bold">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;