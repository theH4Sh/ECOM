import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

const AdminLayout = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/products", label: "Products", icon: "📦" },
    { path: "/admin/orders", label: "Orders", icon: "🛒" },
  ];

  const Sidebar = ({ mobile = false }) => (
    <aside
      className={`bg-white shadow-lg flex flex-col
        ${mobile ? "w-64 h-full" : "w-64 h-full"}
      `}
    >
      {/* LOGO */}
      <div className="p-6 border-b">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-[#0B7C56]">
            Shopz
          </h1>
          <span className="text-xs bg-[#0B7C56] text-white px-2 py-1 rounded">
            Admin
          </span>
        </Link>
      </div>

      {/* NAV */}
      <nav className="p-4 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition
                ${
                  isActive
                    ? "bg-[#0B7C56] text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          <span className="text-xl">🏠</span>
          <span className="font-medium">Back to Store</span>
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* MOBILE DRAWER */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50">
            <Sidebar mobile />
          </div>
        </>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* MOBILE TOP BAR */}
        <header className="lg:hidden bg-white shadow px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setOpen(true)}
            className="text-2xl"
          >
            ☰
          </button>
          <h2 className="font-bold text-[#0B7C56]">
            Admin Panel
          </h2>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
