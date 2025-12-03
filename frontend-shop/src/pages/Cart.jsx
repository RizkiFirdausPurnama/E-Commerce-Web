import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const { sessionId, fetchCart } = useContext(CartContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // Ambil data keranjang saat halaman dibuka
    useEffect(() => {
        getCartData();
    }, []);

    const getCartData = () => {
        axios.get(`${apiUrl}/cart/${sessionId}`)
            .then(res => {
                setCartItems(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    // Fungsi Update Jumlah (+ / -)
    const updateQty = async (itemId, newQty) => {
        if(newQty < 1) return; // Minimal 1
        try {
            await axios.put(`${apiUrl}/cart/${itemId}`, { quantity: newQty });
            getCartData(); // Refresh tabel
            fetchCart();   // Refresh angka di navbar
        } catch (err) {
            console.error(err);
        }
    };

    // Fungsi Hapus Item
    const deleteItem = async (itemId) => {
        if(!window.confirm("Yakin hapus barang ini?")) return;
        try {
            await axios.delete(`${apiUrl}/cart/${itemId}`);
            getCartData();
            fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    // Hitung Total Harga
    const totalPrice = cartItems.reduce((acc, item) => {
        return acc + (item.product_variant.product.base_price * item.quantity);
    }, 0);

    if(loading) return <div className="p-10 text-center">Loading Cart...</div>;

    if(cartItems.length === 0) {
        return (
            <div className="p-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                <Link to="/" className="bg-black text-white px-8 py-3 rounded-full">Go Shopping</Link>
            </div>
        );
    }

    const handleCheckout = async () => {
        try {
            const res = await axios.post(`${apiUrl}/checkout`, {
                session_id: sessionId
            });

            // Refresh Cart Context (agar navbar jadi 0)
            fetchCart();
            
            // Pindah ke halaman Sukses bawa nomor Order
            navigate('/success', { state: { orderNumber: res.data.order_number } });
            
        } catch (err) {
            console.error(err);
            toast.error("Checkout Failed. Please try again.");
        }
    };

    return (
        <div className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-black mb-8 uppercase font-sans">Your Cart</h1>
            
            <div className="flex flex-col lg:flex-row gap-10">
                {/* TABEL PRODUK */}
                <div className="flex-1 border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="space-y-6">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex flex-col md:flex-row items-center gap-6 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                {/* Gambar */}
                                <img 
                                    src={item.product_variant.product.images[0]?.image_url} 
                                    className="w-24 h-24 rounded-xl object-cover bg-gray-100" 
                                    alt="Product"
                                />
                                
                                {/* Info Produk */}
                                <div className="flex-1 text-center md:text-left">
                                    <h4 className="font-bold text-lg">{item.product_variant.product.name}</h4>
                                    <p className="text-sm text-gray-500">
                                        Size: <span className="text-black font-medium">{item.product_variant.size}</span> | 
                                        Color: <span className="text-black font-medium">{item.product_variant.color_name}</span>
                                    </p>
                                    <p className="font-bold text-xl mt-1">${item.product_variant.product.base_price}</p>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-6">
                                    {/* Qty Selector */}
                                    <div className="flex items-center bg-[#F0F0F0] rounded-full px-4 py-2 space-x-4">
                                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="text-sm"><FiMinus/></button>
                                        <span className="font-bold text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="text-sm"><FiPlus/></button>
                                    </div>

                                    {/* Delete */}
                                    <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                                        <FiTrash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RINGKASAN BELANJA (ORDER SUMMARY) */}
                <div className="w-full lg:w-1/3">
                    <div className="border border-gray-200 rounded-2xl p-6 sticky top-24">
                        <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-bold text-black">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Discount (-20%)</span>
                                <span className="font-bold text-red-500">-$0.00</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Delivery Fee</span>
                                <span className="font-bold text-black">$15.00</span>
                            </div>
                        </div>
                        
                        <hr className="mb-6"/>
                        
                        <div className="flex justify-between mb-6 text-xl font-bold">
                            <span>Total</span>
                            <span>${(totalPrice + 15).toFixed(2)}</span>
                        </div>
                        
                        <button 
                        onClick={handleCheckout}  // <--- TAMBAHKAN BARIS INI!
                        className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2">
                            Go to Checkout <span className="text-lg">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;