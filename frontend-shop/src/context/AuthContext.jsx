import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // 1. Cek User saat halaman direfresh
  useEffect(() => {
    const checkUser = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // DEBUG: Pastikan token terambil
            console.log("Token ditemukan di storage, mencoba validasi...");

            // KITA PAKAI HEADER LANGSUNG DISINI (Lebih Aman dibanding defaults)
            const res = await axios.get(`${apiUrl}/user`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("User valid:", res.data);
            
            // Set default untuk request selanjutnya
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(res.data);
            
        } catch (error) {
            console.error("Gagal validasi user (Token Expired/Salah):", error);
            // Hapus token HANYA jika error 401 (Unauthorized)
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    checkUser();
  }, [apiUrl]);

  // 2. Fungsi Login
  const login = async (email, password) => {
    try {
        const res = await axios.post(`${apiUrl}/login`, { email, password });
        
        // DEBUG: Lihat apa yang dikasih Backend
        console.log("Respon Login dari Backend:", res.data);

        // PENTING: Cek apakah backend pakai nama 'token' atau 'access_token'
        // Kode di bawah otomatis pilih yang ada isinya
        const token = res.data.token || res.data.access_token; 

        if (!token) {
            throw new Error("Token tidak ditemukan di respon backend!");
        }
        
        // Simpan Token
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Simpan User
        setUser(res.data.user);
        
        return { success: true, role: res.data.user.role }; 
    } catch (error) {
        console.error("Login Error:", error);
        return { success: false, message: error.response?.data?.message || "Login Failed" };
    }
  };

  const logout = async () => {
    try {
        // Sertakan header saat logout juga
        const token = localStorage.getItem('token');
        await axios.post(`${apiUrl}/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error(error);
    }
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
        {children}
    </AuthContext.Provider>
  );
};