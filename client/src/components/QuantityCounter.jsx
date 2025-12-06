import { useState } from "react";

export default function QuantityCounter({ initial = 1, max }) {
  const [quantity, setQuantity] = useState(initial);

  const increase = () => {
    if (quantity < max) {
        setQuantity(quantity + 1);
    }
  }

  const decrease = () => {
    if (quantity > 1) {
        setQuantity(quantity - 1);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => decrease()}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        -
      </button>
      <span className="px-3 py-1 border rounded">{quantity}</span>
      <button
        onClick={() => increase()}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        +
      </button>
    </div>
  );
}
