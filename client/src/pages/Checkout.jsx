import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { usePostOrder } from "../hooks/usePostOrder";

export default function Checkout() {
  const stripe = useStripe();
  const elements = useElements();

  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const { token } = useSelector((state) => state.auth);

  const { sendOrder, loading, data } = usePostOrder();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cardError, setCardError] = useState("");

  const cardStyleOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#111827",
        fontFamily: "Inter, sans-serif",
        "::placeholder": { color: "#9ca3af" },
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
    hidePostalCode: true,
  };

  const handlePlaceOrder = async () => {
    if (!stripe || !elements) return;

    if (!name || !phone || !address) {
      return toast.error("Please fill all required fields");
    }

    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }));

      const result = await sendOrder({
        items: orderItems,
        name,
        phone,
        address,
      });

      const { clientSecret, order } = result;

      const cardElement = elements.getElement(CardElement);

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name },
        },
      });

      if (paymentResult.error) {
        return toast.error(paymentResult.error.message);
      }

      if (paymentResult.paymentIntent.status === "succeeded") {
        await fetch(
          import.meta.env.VITE_API + `order/mark-paid/${order._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Payment successful 🎉");
      }
    } catch (err) {
      toast.error("Checkout failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* Shipping */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <input
              type="text"
              placeholder="Address"
              className="w-full border rounded-lg px-4 py-2 mt-4 focus:ring-2 focus:ring-black outline-none"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Payment */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Payment Details</h2>

            <div className="border rounded-lg px-4 py-3 bg-gray-50">
              <CardElement
                options={cardStyleOptions}
                onChange={(e) =>
                  setCardError(e.error ? e.error.message : "")
                }
              />
            </div>

            {cardError && (
              <p className="text-sm text-red-500 mt-2">
                {cardError}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white border rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-4 max-h-64 overflow-auto">
            {cartItems.map((item) => (
              <div key={item.product} className="flex items-center gap-3">
                <img
                  src={`http://localhost:8000/images/${item.image}`}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  PKR {item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t mt-5 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>PKR {totalAmount}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="mt-6 w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay & Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
