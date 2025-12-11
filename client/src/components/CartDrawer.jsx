import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeFromCart } from "../slice/cartSlice";
import { usePostOrder } from "../hooks/usePostOrder";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const CartDrawer = ({ open, onClose }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.totalAmount);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
    
    // order
    // const handleCheckout = async () => {
    //   console.log(auth)
    //   if (cartItems.length === 0) {
    //     toast("Your cart is empty!", {
    //       icon: "🛒",
    //     });
    //     return;
    //   }
    //     try {
    //         const { data } = await sendOrder(cartItems);
    //         console.log("Order Successful:", data);
    //         toast.success("Order placed successfully!");
    //         dispatch(clearCart());
    //     } catch (error) {
    //         console.error("Order Failed:", error);
    //         toast.error("Failed to place order. Please try again.");
    //     }
    // };

    const handleCheckout = async () => {
      if (cartItems.length === 0) {
        toast("Your cart is empty!", {
          icon: "🛒",
        });
        return;
       }

      try {
        onClose();
        navigate('/checkout');
      } catch (error) {
          console.error("Order Failed:", error);
          toast.error("Failed to place order. Please try again.");
      }
    };

  return (
    <div
      className={`
        fixed inset-0 z-50 
        transition-all duration-300 
        ${open ? "pointer-events-auto" : "pointer-events-none"}
      `}
    >
      {/* Overlay */}
      <div
        className={`
          absolute inset-0 bg-black/40 transition-opacity
          ${open ? "opacity-100" : "opacity-0"}
        `}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`
          absolute right-0 top-0 h-full w-80 bg-white shadow-xl  
          transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-5 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="p-4 space-y-4">
          {/* Cart items go here */}
          {cartItems.length === 0 && (
            <p>No items yet.</p>
          )}

          {cartItems.map(item => (
            <div key={item.product} className="flex items-center justify-between gap-3 p-3 border-b">
              
              <img 
                src={`http://localhost:8000/images/${item.image}`}
                className="w-16 h-16 object-cover rounded"
              />

              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">PKR {item.price}</p>
                <p className="text-sm">Qty: {item.quantity}</p>
              </div>

              <button onClick={() => dispatch(removeFromCart(item.product))}
                className="text-red-500 hover:text-red-700 cursor-pointer"  
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 text-lg">
          <div className="flex justify-between items-center px-5">
            <span className="font-bold">Total:</span>
            <span>PKR {total}</span>
          </div>
        </div>

        {/* Checkout */}
        <div className="p-5">
          <button 
            onClick={handleCheckout}
            className={`w-full py-3 rounded-lg text-white 
                ${!auth.isAuthenticated ? "bg-gray-400 cursor-not-allowed" : "bg-[#0B7C56] hover:bg-[#095c40]"}
            `}
            disabled={!auth.isAuthenticated}
          >
            {auth.isAuthenticated ? "Checkout" : "Login to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
