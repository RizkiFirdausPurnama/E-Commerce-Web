import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiGrid, FiBox, FiShoppingBag, FiLogOut, FiHome, FiMenu, FiX } from 'react-icons/fi';

const AdminLayout = () => {
  // Ambil 'loading' dari context
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // PENTING: Jangan cek user kalau masih loading!
    if (!loading) {
        if (!user || user.role !== 'admin') {
           navigate('/'); 
        }
    }
  }, [user, loading, navigate]); // Tambahkan loading di dependency

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // TAMPILAN SAAT LOADING (Biar layar gak putih kosong/kedip)
  if (loading) {
      return <div className="min-h-screen flex items-center justify-center font-bold">Checking Access...</div>;
  }

  // Jika Loading selesai, tapi user bukan admin (double protection agar tidak render konten admin)
  if (!user || user.role !== 'admin') {
      return null; 
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
            <div className="h-20 flex items-center px-8 border-b border-gray-100">
                <h1 className="text-2xl font-black uppercase tracking-tighter">SHOP.CO <span className="text-xs bg-black text-white px-2 py-1 rounded ml-1 align-middle">Admin</span></h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <AdminLink to="/admin/dashboard" icon={<FiGrid />} label="Dashboard" active={isActive('/admin/dashboard')} />
                <AdminLink to="/admin/products" icon={<FiBox />} label="Products" active={isActive('/admin/products')} />
                <AdminLink to="/admin/orders" icon={<FiShoppingBag />} label="Orders" active={isActive('/admin/orders')} />
            </nav>
            <div className="p-4 border-t border-gray-100 space-y-2">
                <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-500 hover:text-black hover:bg-gray-50 rounded-xl transition">
                    <FiHome /> Back to Store
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition">
                    <FiLogOut /> Logout
                </button>
            </div>
        </div>
      </aside>

      {/* Konten Kanan */}
      <main className="flex-1 md:ml-64 transition-all">
         <div className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
            <span className="font-black uppercase">Admin Panel</span>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-2xl">
                {isSidebarOpen ? <FiX/> : <FiMenu/>}
            </button>
         </div>
         <div className="p-6 md:p-10">
            <Outlet />
         </div>
      </main>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
};

const AdminLink = ({ to, icon, label, active }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${active ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 hover:text-black'}`}>
        <span className="text-lg">{icon}</span> {label}
    </Link>
);

export default AdminLayout;