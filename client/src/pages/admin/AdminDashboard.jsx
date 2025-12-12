import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch all orders
            const ordersRes = await fetch('http://localhost:8000/api/order/get-all-orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Fetch all products
            const productsRes = await fetch('http://localhost:8000/api/product?limit=1000');
            
            if (ordersRes.ok) {
                const orders = await ordersRes.json();
                const pendingOrders = orders.filter(order => order.orderStatus === 'pending').length;
                const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
                const recentOrders = orders.slice(0, 5);
                
                setStats(prev => ({
                    ...prev,
                    totalOrders: orders.length,
                    pendingOrders,
                    totalRevenue,
                    recentOrders
                }));
            }
            
            if (productsRes.ok) {
                const products = await productsRes.json();
                setStats(prev => ({
                    ...prev,
                    totalProducts: products.length
                }));
            }
        } catch (error) {
            toast.error("Failed to load dashboard data");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <div className="text-4xl">{icon}</div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Total Orders" 
                    value={stats.totalOrders} 
                    icon="🛒" 
                    color="border-blue-500"
                />
                <StatCard 
                    title="Total Products" 
                    value={stats.totalProducts} 
                    icon="📦" 
                    color="border-green-500"
                />
                <StatCard 
                    title="Pending Orders" 
                    value={stats.pendingOrders} 
                    icon="⏳" 
                    color="border-yellow-500"
                />
                <StatCard 
                    title="Total Revenue" 
                    value={`$${stats.totalRevenue.toFixed(2)}`} 
                    icon="💰" 
                    color="border-purple-500"
                />
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
                {stats.recentOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stats.recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            {order.user?.username || order.name}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            ${order.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.orderStatus === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
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
                ) : (
                    <p className="text-gray-500 text-center py-8">No orders yet</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

