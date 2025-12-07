import { useState } from "react";
import { useSelector } from "react-redux";
import { useFetch } from "../hooks/useFetch";

export default function Orders() {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  const { data: orders, loading, error } = useFetch(import.meta.env.VITE_API + "order/get-orders")

  console.log(orders);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-xl">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
    { orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
            <div className="space-y-6">
                {orders.map(order => (
                <div 
                    key={order._id}
                    className="border rounded-lg p-5 shadow-sm bg-white"
                >
                    <div className="flex justify-between items-center">
                    <p className="font-semibold">
                        Order ID: <span className="text-gray-600">{order._id}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                    </p>
                    </div>

                    <div className="mt-3 space-y-3">
                    {order.items.map(item => (
                        <div key={item.product} className="flex items-center gap-3">
                        <img 
                            src={`http://localhost:8000/images/${item.product.image}`}
                            className="w-14 h-14 object-cover rounded"
                        />

                        <div>
                            <p className="font-semibold">{item.product.name}</p>
                            <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                            </p>
                            <p className="text-sm">PKR {item.price}</p>
                        </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>PKR {order.totalAmount}</span>
                </div>
            </div>
        ))}
      </div>
    )}
    </div>
  );
}
