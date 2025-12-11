import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUploadCloud, FiSave, FiCheck, FiType, FiHash } from 'react-icons/fi';

const AddProductPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // State Form Utama
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '', 
    });
    
    // State Warna Custom
    const [colorName, setColorName] = useState(''); // Contoh: "Sunset Orange"
    const [colorHex, setColorHex] = useState('#000000'); // Contoh: "#ED985F"

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [selectedSizes, setSelectedSizes] = useState([]);

    // --- DATA UKURAN YANG LEBIH LENGKAP ---
    const sizeCategories = {
        "Adult Tops (Baju)": ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
        "Adult Bottoms (Celana)": ['28', '29', '30', '31', '32', '33', '34', '36', '38', '40', '42'],
        "Kids (Anak-anak)": ['2T', '3T', '4T', '5T', '6', '8', '10', '12', '14', '16']
    };

    // Handle Perubahan Text Input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Checkbox Ukuran
    const handleSizeChange = (size) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter(s => s !== size));
        } else {
            setSelectedSizes([...selectedSizes, size]);
        }
    };

    // Handle Upload Gambar
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); 
        }
    };

    // SUBMIT FORM
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validasi
        if (!formData.category) return toast.error("Mohon pilih kategori produk.");
        if (!colorName || !colorHex) return toast.error("Mohon isi Nama Warna dan Kode Warnanya.");
        if (!image || selectedSizes.length === 0) return toast.error("Lengkapi gambar dan pilih minimal 1 ukuran.");

        setLoading(true);
        const token = localStorage.getItem('token');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        
        // KIRIM DATA WARNA CUSTOM KE BACKEND
        data.append('color_name', colorName);
        data.append('color_hex', colorHex);

        data.append('image', image);
        
        selectedSizes.forEach((size, index) => {
            data.append(`sizes[${index}]`, size);
        });

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/products`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Produk Berhasil Ditambahkan! 🚀");
            navigate('/admin/dashboard'); 
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Gagal menambahkan produk.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-black mb-8 uppercase text-gray-800">Add New Product</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-8">
                
                {/* 1. INFORMASI DASAR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className="block font-bold mb-2 text-gray-700">Product Name</label>
                        <input 
                            type="text" name="name" required
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                            placeholder="e.g. Jeans Relaxed Fit"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-full">
                        <label className="block font-bold mb-2 text-gray-700">Description</label>
                        <textarea 
                            name="description" required rows="4"
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                            placeholder="Explain material, fit, and details..."
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block font-bold mb-2 text-gray-700">Price ($)</label>
                        <input 
                            type="number" name="price" required
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                            placeholder="45"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-2 text-gray-700">Category / Gender</label>
                        <select 
                            name="category" required
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                            onChange={handleChange}
                            value={formData.category} 
                        >
                            <option value="" disabled>Select Category</option>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Kids">Kids</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* 2. CUSTOM COLOR INPUT */}
                <div>
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Product Color</h3>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Input Nama Warna */}
                        <div className="flex-1 w-full">
                            <label className="text-sm font-semibold text-gray-500 mb-1 block">Color Name</label>
                            <div className="relative">
                                <FiType className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="e.g. Navy Blue, Sunset Orange" 
                                    className="w-full pl-10 border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                                    value={colorName}
                                    onChange={(e) => setColorName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Input Kode Hex & Color Picker */}
                        <div className="flex-1 w-full">
                            <label className="text-sm font-semibold text-gray-500 mb-1 block">Color Hex (RGB)</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="#000000" 
                                        className="w-full pl-10 border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-black outline-none uppercase"
                                        value={colorHex}
                                        onChange={(e) => setColorHex(e.target.value)}
                                        maxLength={7}
                                        required
                                    />
                                </div>
                                {/* Visual Color Picker */}
                                <input 
                                    type="color" 
                                    value={colorHex}
                                    onChange={(e) => setColorHex(e.target.value)}
                                    className="h-[50px] w-[50px] rounded-xl cursor-pointer border-none p-0 bg-transparent"
                                    title="Pick a color"
                                />
                            </div>
                        </div>

                        {/* Preview Warna */}
                        <div className="text-center">
                            <label className="text-sm font-semibold text-gray-500 mb-1 block">Preview</label>
                            <div 
                                className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm mx-auto"
                                style={{ backgroundColor: colorHex }}
                            ></div>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* 3. SIZE SELECTION (GROUPED) */}
                <div>
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Available Sizes</h3>
                    
                    <div className="space-y-6">
                        {Object.entries(sizeCategories).map(([category, sizes]) => (
                            <div key={category} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h4 className="font-bold text-sm text-gray-500 mb-3 uppercase">{category}</h4>
                                <div className="flex gap-3 flex-wrap">
                                    {sizes.map(size => (
                                        <label key={size} className={`
                                            cursor-pointer px-4 py-2 rounded-lg border transition text-sm font-medium
                                            ${selectedSizes.includes(size) 
                                                ? 'bg-black text-white border-black shadow-md transform scale-105' 
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}
                                        `}>
                                            <input 
                                                type="checkbox" className="hidden" 
                                                checked={selectedSizes.includes(size)}
                                                onChange={() => handleSizeChange(size)}
                                            />
                                            {size}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* 4. UPLOAD GAMBAR */}
                <div>
                    <label className="block font-bold mb-2 text-gray-700">Product Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition relative group">
                        <input 
                            type="file" accept="image/*" onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        {preview ? (
                            <div className="relative inline-block">
                                <img src={preview} alt="Preview" className="h-64 object-contain rounded-lg shadow-md" />
                                <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-lg font-bold">
                                    Change Image
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-400 space-y-2">
                                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiUploadCloud className="text-3xl text-gray-500" />
                                </div>
                                <p className="font-bold text-gray-600">Click or Drag to upload image</p>
                                <p className="text-sm">SVG, PNG, JPG or GIF (max. 2MB)</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* TOMBOL SUBMIT */}
                <button 
                    disabled={loading}
                    className="w-full bg-black text-white py-5 rounded-xl font-bold text-xl hover:bg-gray-900 transition flex items-center justify-center gap-3 shadow-xl transform active:scale-[0.99]"
                >
                    {loading ? "Publishing..." : <><FiSave /> Publish Product</>}
                </button>
            </form>
        </div>
    );
};

export default AddProductPage;