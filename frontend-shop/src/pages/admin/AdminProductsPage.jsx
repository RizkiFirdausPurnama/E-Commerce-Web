import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrash2, FiEdit, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // --- FUNGSI PINTAR: PERBAIKI LINK GAMBAR ---
    const getImageUrl = (path) => {
        if (!path) return 'https://placehold.co/300';
        if (path.startsWith('http')) return path; 
        const baseUrl = apiUrl.replace('/api', '');
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${baseUrl}${cleanPath}`;
    };

    // Ambil Data Produk
    const fetchProducts = () => {
        axios.get(`${apiUrl}/products`)
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Fungsi Hapus Produk
    const handleDelete = async (id) => {
        if(!window.confirm("Yakin ingin menghapus produk ini?")) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${apiUrl}/admin/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Produk berhasil dihapus");
            fetchProducts(); // Refresh data
        } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus produk");
        }
    };

    // Filter Pencarian
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 font-bold text-gray-500">Loading Products...</div>;

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            
            {/* HEADER: Judul & Tombol Add */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">All Products</h1>
                    <p className="text-gray-500 text-sm">Manage your inventory here</p>
                </div>
                
                <Link 
                    to="/admin/add-product" 
                    className="bg-black text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-800 transition shadow-lg"
                >
                    <FiPlus size={20} /> Add New Product
                </Link>
            </div>

            {/* SEARCH BAR */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 flex items-center gap-3">
                <FiSearch className="text-gray-400 text-xl" />
                <input 
                    type="text" 
                    placeholder="Search product by name..." 
                    className="flex-1 outline-none font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* TABEL PRODUK */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Image</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Product Name</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Price</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                <img 
                                                    src={getImageUrl(product.images[0]?.image_url)} 
                                                    alt="thumb" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">{product.name}</td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {/* Cek kalau pakai relasi atau string biasa */}
                                            {product.category?.name || product.category || '-'}
                                        </td>
                                        <td className="p-4 font-mono font-medium">${product.base_price}</td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(product.id)}
                                                className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition"
                                                title="Delete"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-gray-400">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminProductsPage;