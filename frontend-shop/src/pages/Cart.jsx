import React, { useEffect, useState, useContext, useRef } from 'react'; // Tambah useRef
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

    // Ref untuk menyimpan timer Debounce
    const debounceTimeout = useRef(null);

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

    // --- FUNGSI UPDATE JUMLAH (OPTIMISTIC & DEBOUNCE) ---
    const updateQty = (itemId, newQty) => {
        if (newQty < 1) return;

        // 1. OPTIMISTIC UI: Update tampilan layar DULUAN (Instan)
        // Kita manipulasi state lokal biar user merasa cepat
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === itemId ? { ...item, quantity: newQty } : item
            )
        );

        // 2. DEBOUNCE: Tahan request ke server
        // Kalau ada request pending sebelumnya, batalkan dulu
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // Tunggu 500ms setelah klik terakhir, baru kirim ke server
        debounceTimeout.current = setTimeout(() => {
            axios.put(`${apiUrl}/cart/${itemId}`, { quantity: newQty })
                .then(() => {
                    // Sukses di server, sinkronkan ulang navbar
                    fetchCart(); 
                })
                .catch(err => {
                    console.error(err);
                    toast.error("Gagal update stok");
                    // Kalau gagal, kembalikan data asli dari server (Rollback)
                    getCartData(); 
                });
        }, 500); 
    };

    // Fungsi Hapus Item (Tetap sama, tambahkan update state lokal biar cepat)
    const deleteItem = (itemId) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <span className="font-medium text-sm text-gray-800">
                    Yakin hapus item ini?
                </span>
                <div className="flex gap-2 mt-1">
                    <button 
                        onClick={() => {
                            toast.dismiss(t.id);
                            performDelete(itemId);
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-red-700 transition"
                    >
                        Hapus
                    </button>
                    <button 
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-xs font-bold hover:bg-gray-300 transition"
                    >
                        Batal
                    </button>
                </div>
            </div>
        ), { duration: 5000, icon: '🗑️' });
    };

    const performDelete = async (itemId) => {
        // Optimistic Delete: Hapus dari layar dulu
        setCartItems(prev => prev.filter(item => item.id !== itemId));

        try {
            await axios.delete(`${apiUrl}/cart/${itemId}`);
            fetchCart(); // Update navbar
            toast.success("Item dihapus");
        } catch (err) {
            console.error(err);
            toast.error("Gagal menghapus");
            getCartData(); // Rollback jika gagal
        }
    };

    // Hitung Total Harga (Otomatis cepat karena pakai state lokal)
    const totalPrice = cartItems.reduce((acc, item) => {
        return acc + (item.product_variant.product.base_price * item.quantity);
    }, 0);

    const handleCheckout = async () => {
        try {
            const res = await axios.post(`${apiUrl}/checkout`, {
                session_id: sessionId
            });
            fetchCart();
            toast.success("Checkout Berhasil!");
            navigate('/success', { state: { orderNumber: res.data.order_number } });
        } catch (err) {
            console.error(err);
            if(err.response && err.response.status === 400) {
                toast.error("Keranjang kosong atau sesi habis.");
            } else {
                toast.error("Gagal Checkout. Coba lagi.");
            }
        }
    };

    if (loading) return <div className="p-20 text-center font-bold text-gray-500">Loading Cart...</div>;

    if (cartItems.length === 0) {
        return (
            <div className="p-20 text-center flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                <Link to="/" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition">Go Shopping</Link>
            </div>
        );
    }

    return (
        <div className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-black mb-8 uppercase font-sans">Your Cart</h1>
            
            <div className="flex flex-col lg:flex-row gap-10">
                {/* TABEL PRODUK */}
                <div className="flex-1 border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
                    <div className="space-y-6">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex flex-col md:flex-row items-center gap-6 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                    <img 
                                        src={item.product_variant.product.images[0]?.image_url} 
                                        className="w-full h-full object-cover" 
                                        alt="Product"
                                    />
                                </div>
                                
                                <div className="flex-1 text-center md:text-left">
                                    <h4 className="font-bold text-lg">{item.product_variant.product.name}</h4>
                                    <p className="text-sm text-gray-500">
                                        Size: <span className="text-black font-medium">{item.product_variant.size}</span> | 
                                        Color: <span className="text-black font-medium">{item.product_variant.color_name}</span>
                                    </p>
                                    <p className="font-bold text-xl mt-1">${item.product_variant.product.base_price}</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center bg-[#F0F0F0] rounded-full px-4 py-2 space-x-4">
                                        {/* Tombol Kurang */}
                                        <button 
                                            onClick={() => updateQty(item.id, item.quantity - 1)} 
                                            className="text-sm hover:text-gray-600 active:scale-90 transition"
                                        >
                                            <FiMinus/>
                                        </button>
                                        
                                        {/* Angka Jumlah */}
                                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                        
                                        {/* Tombol Tambah */}
                                        <button 
                                            onClick={() => updateQty(item.id, item.quantity + 1)} 
                                            className="text-sm hover:text-gray-600 active:scale-90 transition"
                                        >
                                            <FiPlus/>
                                        </button>
                                    </div>

                                    <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                                        <FiTrash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RINGKASAN BELANJA */}
                <div className="w-full lg:w-1/3">
                    <div className="border border-gray-200 rounded-2xl p-6 sticky top-24 shadow-sm">
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
                            onClick={handleCheckout} 
                            className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Go to Checkout <span className="text-lg">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;