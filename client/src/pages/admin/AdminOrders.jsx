import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useFetch } from "../../hooks/useFetch";
import { getErrorMessage } from "../../lib/api";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const token = useSelector((state) => state.auth.token);

  const { data, loading, error } = useFetch(`${import.meta.env.VITE_API}order/get-all-orders`);

  useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}order/update-order-status/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        toast.error(getErrorMessage(err, "Failed to update order status"));
        return;
      }

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );

      setSelectedOrder((prev) =>
        prev && prev._id === orderId ? { ...prev, orderStatus: newStatus } : prev
      );

      toast.success("Order status updated!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-gray-600">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center text-red-600">
        {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Orders Management</h1>
        <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">
          View and manage all customer orders
        </p>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        {orders.length > 0 ? (
          <>
            <div className="space-y-3 p-4 lg:hidden">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-gray-800">
                        {order.user?.username || order.name}
                      </p>
                      <p className="text-xs text-gray-500">{order.phone}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        STATUS_STYLES[order.orderStatus] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Items</p>
                      <p className="font-medium">{order.items.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="font-medium">PKR {order.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="mt-4 w-full rounded-lg border border-[#0B7C56] py-2 text-sm font-medium text-[#0B7C56] transition hover:bg-[#0B7C56] hover:text-white"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{order.user?.username || order.name}</div>
                          <div className="text-xs text-gray-500">{order.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.items.length} item(s)
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        PKR {order.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            STATUS_STYLES[order.orderStatus] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="font-medium text-[#0B7C56] hover:text-[#096347]"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <div className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white sm:max-w-2xl sm:rounded-xl">
            <div className="flex shrink-0 items-center justify-between border-b px-4 py-4 sm:px-6">
              <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      STATUS_STYLES[selectedOrder.orderStatus] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-lg font-medium">
                    PKR {selectedOrder.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3 font-bold text-gray-800">Customer Information</h3>
                <div className="space-y-2 text-sm sm:text-base">
                  <p>
                    <span className="text-gray-600">Name:</span>{" "}
                    <span className="font-medium">{selectedOrder.name}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Phone:</span>{" "}
                    <span className="font-medium">{selectedOrder.phone}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Address:</span>{" "}
                    <span className="font-medium">{selectedOrder.address}</span>
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3 font-bold text-gray-800">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 sm:gap-4"
                    >
                      <img
                        src={`${import.meta.env.VITE_IMAGE_ENDPOINT}${item.product.image}`}
                        alt={item.product.name}
                        className="h-14 w-14 shrink-0 rounded object-cover sm:h-16 sm:w-16"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="shrink-0 text-sm font-medium sm:text-base">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3 font-bold text-gray-800">Update Order Status</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                  {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                      disabled={selectedOrder.orderStatus === status}
                      className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all sm:px-4 ${
                        selectedOrder.orderStatus === status
                          ? "cursor-not-allowed bg-gray-200 text-gray-500"
                          : "bg-[#0B7C56] text-white hover:bg-[#096347]"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
