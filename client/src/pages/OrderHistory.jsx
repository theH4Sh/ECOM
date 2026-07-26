import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import OrderCard from "../components/OrderCard";
import SkeletonOrderCard from "../components/SkeletonOrderCard";

export default function Orders() {
  const { data: orders, loading, error } = useFetch(
    import.meta.env.VITE_API + "order/get-orders"
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>

      {loading && (
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <SkeletonOrderCard key={i} />
          ))}
        </div>
      )}

      {error && (
        <div className={`rounded-2xl px-6 py-8 text-center ${
          error.message === "Email not verified"
            ? "border border-amber-200 bg-amber-50 text-amber-900"
            : "border border-red-100 bg-red-50 text-red-600"
        }`}>
          {error.message === "Email not verified" ? (
            <>
              <h2 className="text-lg font-semibold">Verify your email</h2>
              <p className="mt-2">
                Check your inbox for the verification link to view your order history.
              </p>
            </>
          ) : (
            error.message
          )}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 text-2xl">
            📦
          </div>
          <h2 className="text-lg font-semibold text-gray-900">No orders yet</h2>
          <p className="mt-2 text-gray-500">
            When you place an order, it will show up here.
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-[#0B7C56] text-white text-sm font-medium hover:bg-[#095c40] transition"
          >
            Start shopping
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && <OrderCard orders={orders} />}
    </div>
  );
}
