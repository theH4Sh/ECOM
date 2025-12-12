import { Link, Outlet, useLocation, Navigate } from "react-router-dom";

const AdminLayout = () => {
    const location = useLocation();

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: '📊' },
        { path: '/admin/products', label: 'Products', icon: '📦' },
        { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg">
                <div className="p-6 border-b">
                    <Link to="/" className="flex items-center gap-2">
                        <h1 className="text-2xl font-extrabold text-[#0B7C56]">Shopz</h1>
                        <span className="text-xs bg-[#0B7C56] text-white px-2 py-1 rounded">Admin</span>
                    </Link>
                </div>
                
                <nav className="p-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
                                    isActive 
                                        ? 'bg-[#0B7C56] text-white shadow-md' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-64 p-4 border-t">
                    <Link 
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <span className="text-xl">🏠</span>
                        <span className="font-medium">Back to Store</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;

