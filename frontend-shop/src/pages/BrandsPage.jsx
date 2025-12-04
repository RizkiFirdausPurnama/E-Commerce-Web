import React from 'react';

const BrandsPage = () => {
const brands = [
    "VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein", 
    "CHANEL", "DIOR", "H&M", "UNIQLO", "NIKE", "Molas"
];

return (
    <div className="px-6 md:px-10 py-20 max-w-7xl mx-auto min-h-screen">
    <h1 className="text-4xl font-black uppercase mb-12 font-sans text-center">Our Premium Partners</h1>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {brands.map((brand, idx) => (
            <div key={idx} className="h-40 border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 cursor-pointer shadow-sm group">
                <span className="text-2xl md:text-3xl font-serif tracking-widest group-hover:scale-110 transition">{brand}</span>
            </div>
        ))}
    </div>
    </div>
);
};

export default BrandsPage;