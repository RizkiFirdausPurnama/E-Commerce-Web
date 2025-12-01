import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Cek apakah ada token tersimpan di Local Storage
    const [token, setToken] = useState(localStorage.getItem('auth_token') || null);
    const [user, setUser] = useState(null);
    
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // Set default header axios jika token ada
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Fungsi Login
    const login = async (email, password) => {
        try {
            const res = await axios.post(`${apiUrl}/login`, { email, password });
            const newToken = res.data.access_token;
            
            // Simpan token ke storage & state
            localStorage.setItem('auth_token', newToken);
            setToken(newToken);
            setUser(res.data.user);
            
            // Set header agar request selanjutnya dianggap login
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            return true;
        } catch (error) {
            console.error("Login Gagal:", error);
            return false;
        }
    };

    // Fungsi Logout
    const logout = async () => {
        try {
            await axios.post(`${apiUrl}/logout`);
        } catch(e) { console.error(e); }
        
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    // Cek User Profile saat aplikasi dimuat (agar tidak logout saat refresh)
    useEffect(() => {
        if (token) {
            axios.get(`${apiUrl}/user`)
                .then(res => setUser(res.data))
                .catch(() => {
                    // Kalau token tidak valid/expired, logout paksa
                    logout();
                });
        }
    }, [token, apiUrl]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};