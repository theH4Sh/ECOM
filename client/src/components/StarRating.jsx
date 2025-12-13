// components/StarRating.jsx
import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function StarRating({ rating, setRating }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={28}
          className={`cursor-pointer transition 
            ${star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"}`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        />
      ))}
    </div>
  );
}
