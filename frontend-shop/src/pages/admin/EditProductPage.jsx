import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUploadCloud, FiSave, FiType, FiHash } from 'react-icons/fi';

const EditProductPage = () => {
    const { id } = useParams(); // Ambil ID produk dari URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // State Form
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: '', 
    });
    const [colorName, setColorName] = useState('');
    const [colorHex, setColorHex] = useState('#000000');
    const [image, setImage] = useState(null); // File baru
    const [preview, setPreview] = useState(null); // Preview gambar
    const [selectedSizes, setSelectedSizes] = useState([]);

    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // Helper Image URL
    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path; 
        const baseUrl = apiUrl.replace('/api', '');
        return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    };

    const sizeCategories = {
        "Adult Tops": ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
        "Adult Bottoms": ['28', '29', '30', '31', '32', '33', '34', '36', '38', '40', '42'],
        "Kids": ['2T', '3T', '4T', '5T', '6', '8', '10', '12', '14', '16']
    };

    // 1. AMBIL DATA PRODUK SAAT LOAD
    useEffect(() => {
        axios.get(`${apiUrl}/products/${id}`) // Kita pakai endpoint publik untuk ambil detail
            .then(res => {
                const p = res.data;
                setFormData({
                    name: p.name,
                    description: p.description,
                    price: p.base_price,
                    category: p.category ? p.category.name : '', // Sesuaikan struktur relasi
                });

                // Set Gambar Lama
                if(p.images && p.images.length > 0) {
                    setPreview(getImageUrl(p.images[0].image_url));
                }

                // Set Warna & Size (Ambil dari varian pertama)
                if(p.variants && p.variants.length > 0) {
                    setColorName(p.variants[0].color_name);
                    setColorHex(p.variants[0].color_hex);
                    
                    // Ambil semua size unik yang ada
                    const sizes = [...new Set(p.variants.map(v => v.size))];
                    setSelectedSizes(sizes);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                toast.error("Gagal mengambil data produk");
                navigate('/admin/products');
            });
    }, [id, apiUrl, navigate]);

    // Handle Change Input
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSizeChange = (size) => {
        if (selectedSizes.includes(size)) setSelectedSizes(selectedSizes.filter(s => s !== size));
        else setSelectedSizes([...selectedSizes, size]);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); 
        }
    };

    // 2. KIRIM UPDATE KE BACKEND
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUploading(true);
        const token = localStorage.getItem('token');

        const data = new FormData();
        // Method Spoofing: Laravel butuh ini untuk handle File Upload di method PUT
        data.append('_method', 'PUT'); 

        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('color_name', colorName);
        data.append('color_hex', colorHex);
        
        selectedSizes.forEach((size, index) => data.append(`sizes[${index}]`, size));
        
        // Kirim gambar HANYA jika user memilih gambar baru
        if (image) {
            data.append('image', image);
        }

        try {
            // Endpoint: POST /api/admin/products/{id} (Tapi isinya _method=PUT)
            await axios.post(`${apiUrl}/admin/products/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Produk Berhasil Diupdate! 🎉");
            navigate('/admin/products'); 
        } catch (error) {
            console.error(error);
            toast.error("Gagal update produk.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold">Loading Data...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-black mb-8 uppercase">Edit Product</h1>

            <form onSubmit={handleUpdate} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-8">
                {/* Form Input (Sama seperti Add Product) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className="block font-bold mb-2">Product Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border p-3 rounded-xl"/>
                    </div>
                    <div className="col-span-full">
                        <label className="block font-bold mb-2">Description</label>
                        <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} className="w-full border p-3 rounded-xl"></textarea>
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Price ($)</label>
                        <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full border p-3 rounded-xl"/>
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Category</label>
                        <select name="category" required value={formData.category} onChange={handleChange} className="w-full border p-3 rounded-xl">
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Kids">Kids</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>
                </div>

                <hr className="border-gray-100" />
                
                {/* Warna */}
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label className="block font-bold mb-2">Color Name</label>
                        <div className="relative"><FiType className="absolute left-3 top-3 text-gray-400"/><input type="text" value={colorName} onChange={e=>setColorName(e.target.value)} className="w-full pl-10 border p-3 rounded-xl" required/></div>
                    </div>
                    <div className="flex-1">
                         <label className="block font-bold mb-2">Color Hex</label>
                         <div className="flex gap-2">
                            <div className="relative flex-1"><FiHash className="absolute left-3 top-3 text-gray-400"/><input type="text" value={colorHex} onChange={e=>setColorHex(e.target.value)} className="w-full pl-10 border p-3 rounded-xl uppercase" required/></div>
                            <input type="color" value={colorHex} onChange={e=>setColorHex(e.target.value)} className="h-[50px] w-[50px] rounded-xl cursor-pointer border-none bg-transparent"/>
                         </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Size */}
                <div>
                    <h3 className="font-bold text-lg mb-4">Sizes</h3>
                    <div className="space-y-4">
                        {Object.entries(sizeCategories).map(([cat, sizes]) => (
                            <div key={cat} className="bg-gray-50 p-4 rounded-xl">
                                <h4 className="font-bold text-xs text-gray-400 uppercase mb-2">{cat}</h4>
                                <div className="flex gap-2 flex-wrap">
                                    {sizes.map(size => (
                                        <label key={size} className={`cursor-pointer px-4 py-2 rounded-lg border text-sm font-bold transition ${selectedSizes.includes(size) ? 'bg-black text-white border-black' : 'bg-white text-gray-500'}`}>
                                            <input type="checkbox" className="hidden" checked={selectedSizes.includes(size)} onChange={() => handleSizeChange(size)}/>
                                            {size}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Upload Gambar */}
                <div>
                    <label className="block font-bold mb-2">Product Image (Upload new to replace)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center relative group">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
                        {preview ? (
                            <img src={preview} alt="Preview" className="h-40 mx-auto object-contain rounded-lg shadow-md" />
                        ) : (
                            <div className="text-gray-400"><FiUploadCloud className="text-3xl mx-auto mb-2"/><p>Click to upload new image</p></div>
                        )}
                    </div>
                </div>

                <button disabled={uploading} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition flex items-center justify-center gap-2">
                    {uploading ? "Updating..." : <><FiSave /> Save Changes</>}
                </button>
            </form>
        </div>
    );
};

export default EditProductPage;