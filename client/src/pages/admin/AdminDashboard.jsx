import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { parseApiError, toastApiError } from "../../lib/api";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const ordersRes = await fetch(`${import.meta.env.VITE_API}order/get-all-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const productsRes = await fetch(`${import.meta.env.VITE_API}product?limit=1000`);

      if (ordersRes.ok) {
        const orders = await ordersRes.json();
        const pendingOrders = orders.filter((order) => order.orderStatus === "pending").length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const recentOrders = orders.slice(0, 5);

        setStats((prev) => ({
          ...prev,
          totalOrders: orders.length,
          pendingOrders,
          totalRevenue,
          recentOrders,
        }));
      } else {
        throw await parseApiError(ordersRes, "Failed to load orders");
      }

      if (productsRes.ok) {
        const products = await productsRes.json();
        setStats((prev) => ({
          ...prev,
          totalProducts: products.length,
        }));
      } else {
        throw await parseApiError(productsRes, "Failed to load products");
      }
    } catch (error) {
      toastApiError(error, "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`rounded-xl border-l-4 bg-white p-4 shadow-md sm:p-6 ${color}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-600 sm:text-sm">{title}</p>
          <p className="mt-1 truncate text-2xl font-bold sm:mt-2 sm:text-3xl">{value}</p>
        </div>
        <div className="shrink-0 text-2xl sm:text-4xl">{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        <StatCard title="Total Orders" value={stats.totalOrders} icon="🛒" color="border-blue-500" />
        <StatCard title="Total Products" value={stats.totalProducts} icon="📦" color="border-green-500" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon="⏳" color="border-yellow-500" />
        <StatCard
          title="Total Revenue"
          value={`PKR ${stats.totalRevenue.toLocaleString()}`}
          icon="💰"
          color="border-purple-500"
        />
      </div>

      <div className="rounded-xl bg-white p-4 shadow-md sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-800 sm:text-xl">Recent Orders</h2>

        {stats.recentOrders.length > 0 ? (
          <>
            <div className="space-y-3 lg:hidden">
              {stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {order.user?.username || order.name}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        STATUS_STYLES[order.orderStatus] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">
                      PKR {order.totalAmount.toLocaleString()}
                    </span>
                    <span className="text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {order.user?.username || order.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        PKR {order.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            STATUS_STYLES[order.orderStatus] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="py-8 text-center text-gray-500">No orders yet</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
