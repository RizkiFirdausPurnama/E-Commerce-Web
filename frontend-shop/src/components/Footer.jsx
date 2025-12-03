import React from 'react';
// Kita gunakan icon dari react-icons agar mirip dengan desain
// Pastikan sudah install: npm install react-icons
import { FiTwitter, FiFacebook, FiInstagram, FiGithub } from 'react-icons/fi';
// Menggunakan icon FontAwesome untuk payment gateway sebagai representasi visual
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcApplePay, FaGooglePay } from 'react-icons/fa';

const Footer = () => {
    return (
    // Container utama dengan background abu-abu terang
    <footer className="bg-[#F0F0F0] px-6 md:px-20 pt-16 pb-8 font-sans mt-20">
        <div className="max-w-7xl mx-auto">
        
        {/* === Bagian Atas (Hanya Brand & Sosmed) === */}
        <div className="mb-16">
            <div className="max-w-sm">
                {/* Logo Brand */}
                <h2 className="text-3xl font-black tracking-tighter uppercase mb-6">SHOP.CO</h2>
                {/* Deskripsi */}
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    We have clothes that suits your style and which you're proud to wear. From women to men.
                </p>
                
                {/* Social Media Icons */}
                <div className="flex items-center gap-4">
                    {/* Icon Wrapper (Lingkaran putih dengan border) */}
                    <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xl hover:bg-black hover:text-white transition-colors duration-300">
                        <FiTwitter />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xl hover:bg-black hover:text-white transition-colors duration-300">
                        <FiFacebook />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xl hover:bg-black hover:text-white transition-colors duration-300">
                        <FiInstagram />
                    </a>
                </div>
            </div>
        </div>

        {/* === Bagian Bawah (Separator, Copyright, Payments) === */}
        {/* Border top sebagai garis pemisah */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright Text */}
            <p className="text-sm text-gray-500 text-center md:text-left">
                Shop.co © 2000-2023. All Rights Reserved
            </p>

            {/* Payment Icons */}
            {/* Menggunakan icon font awesome sebagai placeholder visual yang mirip */}
            <div className="flex items-center gap-4 text-gray-400 text-3xl">
                <FaCcVisa title="Visa" className="hover:text-[#1A1F71] transition"/>
                <FaCcMastercard title="Mastercard" className="hover:text-[#EB001B] transition"/>
                <FaCcPaypal title="PayPal" className="hover:text-[#003087] transition"/>
                <FaCcApplePay title="Apple Pay" className="hover:text-black transition"/>
                <FaGooglePay title="Google Pay" className="hover:text-black transition"/>
                {/* Catatan: Jika ingin persis seperti gambar, Anda perlu menggunakan file SVG/PNG asli dari masing-masing provider pembayaran */}
            </div>
        </div>

    </div>
    </footer>
);
};

export default Footer;