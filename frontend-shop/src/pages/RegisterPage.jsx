import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    const { setUser } = useContext(AuthContext);

    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/register`, {
                name,
                email,
                password
            });
            
            // === PERBAIKAN PENTING DI SINI ===
            // Backend kamu mengirim 'access_token', jadi kita harus menangkapnya.
            // Kode ini akan mencoba mencari 'token', kalau tidak ada dia ambil 'access_token'.
            const token = response.data.token || response.data.access_token;

            // Jika token tetap tidak ada (backend error), hentikan proses
            if (!token) {
                toast.success("Registrasi Berhasil! Silakan Login Manual.");
                navigate('/login');
                return;
            }

            // 1. Simpan Token yang sudah pasti benar
            localStorage.setItem('token', token);
            
            // 2. Set Header agar request selanjutnya dianggap login
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // 3. Update status user di aplikasi
            setUser(response.data.user);
            
            toast.success("Registrasi Berhasil! Anda otomatis login.");
            navigate('/'); // Langsung masuk ke Home
            
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data.message) {
                toast.error("Gagal: " + error.response.data.message);
            } else {
                toast.error("Registrasi Gagal.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh] px-4 bg-gray-50">
            <form onSubmit={handleRegister} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-3xl font-black mb-6 text-center uppercase font-sans">Register</h2>
                
                <div className="mb-4">
                    <label className="block mb-2 font-bold text-sm">Full Name</label>
                    <input 
                        type="text" value={name} onChange={e=>setName(e.target.value)} 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black" 
                        required 
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 font-bold text-sm">Email Address</label>
                    <input 
                        type="email" value={email} onChange={e=>setEmail(e.target.value)} 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black" 
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-bold text-sm">Password</label>
                    <input 
                        type="password" value={password} onChange={e=>setPassword(e.target.value)} 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-black" 
                        required 
                    />
                </div>

                <button className="w-full bg-black text-white py-3 rounded-full font-bold hover:bg-gray-800 transition">
                    Create Account
                </button>
                
                <p className="mt-6 text-center text-sm text-gray-500">
                    Sudah punya akun? <Link to="/login" className="text-black font-bold hover:underline">Login di sini</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;