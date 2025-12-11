import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePostOrder } from "../hooks/usePostOrder";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Checkout() {
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const { token } = useSelector((state) => state.auth);

  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const { sendOrder, loading } = usePostOrder();

  const handlePlaceOrder = async () => {
    if (!name || !phone || !address) {
      toast.error("Please fill in all required fields");
      return;
    }

    const orderItems = cartItems.map(item => ({
      product: item.product,
      quantity: item.quantity
    }));

    console.log("name:", name);
    console.log("phone:", phone);
    console.log("address:", address);

    try {
      await sendOrder({
        items: orderItems,
        name,
        phone,
        address
      });
      toast.success("Order placed successfully");
    } catch (error) {
      return toast.error("Failed to place order");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Form */}

      <div>
        <h2 className="text-xl font-bold mb-3">Shipping Information</h2>
        <form className="space-y-4 mb-8">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your full name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Address</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your phone number"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* <div>
            <label className="block mb-1 font-medium">City</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your city"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Postal Code</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your postal code"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Country</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your country"
            />
          </div> */}
        </form>
      </div>

      {/* Cart Section */}
      <div className="space-y-5">
        {cartItems.length === 0 && (
          <p>Your cart is empty.</p>
        )}
        {cartItems.map(item => (
          <div key={item.product} className="flex items-center gap-4 border rounded p-4 bg-white shadow-sm">
            <img 
              src={`http://localhost:8000/images/${item.image}`} 
              className="w-20 h-20 object-cover rounded" 
            />

            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>

            <p className="font-semibold">PKR {item.price}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 border p-5 rounded bg-gray-50">
        <h2 className="text-xl font-bold mb-3">Order Summary</h2>

        <div className="flex justify-between py-1">
          <span>Total Items:</span>
          <span>{cartItems.length}</span>
        </div>

        <div className="flex justify-between py-1 font-semibold text-lg">
          <span>Total Amount:</span>
          <span>PKR {totalAmount}</span>
        </div>

        <button 
          onClick={handlePlaceOrder}
          className="mt-5 w-full bg-black text-white py-3 rounded-lg text-lg hover:bg-gray-800 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
