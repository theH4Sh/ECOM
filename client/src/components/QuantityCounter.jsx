import { useEffect, useState } from "react";

export default function QuantityCounter({ initial = 1, max, onChange }) {
  const [quantity, setQuantity] = useState(initial);

  const increase = () => {
    if (quantity < max) setQuantity(quantity + 1);
  };

  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  useEffect(() => {
    onChange(quantity);
  }, [quantity]);

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Decrease Button */}
      <button
        onClick={decrease}
        disabled={quantity <= 1}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 shadow hover:scale-110 ${
          quantity <= 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-800 hover:bg-red-500 hover:text-white cursor-pointer"
        }`}
      >
        –
      </button>

      {/* Quantity Display */}
      <div className="w-12 h-10 flex items-center justify-center bg-gradient-to-r from-green-100 to-green-200 rounded-full font-semibold text-gray-900 shadow-inner text-lg">
        {quantity}
      </div>

      {/* Increase Button */}
      <button
        onClick={increase}
        disabled={quantity >= max}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 shadow hover:scale-110 ${
          quantity >= max
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-800 hover:bg-[#0B7C56] hover:text-white cursor-pointer"
        }`}
      >
        +
      </button>
    </div>
  );
}
