const CartDrawer = ({ open, onClose }) => {
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
          <p>No items yet.</p>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
