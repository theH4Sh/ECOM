import { useState } from "react";
import { useSelector } from "react-redux";
import { useFetch } from "../hooks/useFetch";
import OrderCard from "../components/OrderCard";

export default function Orders() {
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  const { data: orders, loading, error } = useFetch(import.meta.env.VITE_API + "order/get-orders")

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
        {loading && (
            <div className="flex justify-center items-center h-[70vh] text-xl">
                Loading your orders...
            </div>
            )
        }

        {error && (
            <div className="flex justify-center items-center h-[70vh] text-xl text-red-500">
                Error: {error.message}
            </div>
            )
        }

        {orders.length === 0 && !loading ? (
            <p>You have no orders yet.</p>
        ) : (
                <OrderCard orders={orders} />
        )}
    </div>
  );
}
