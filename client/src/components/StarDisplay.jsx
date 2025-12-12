// components/StarDisplay.jsx
import { FaStar } from "react-icons/fa";

export default function StarDisplay({ rating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar 
          key={star} 
          size={20} 
          className={star <= rating ? "text-yellow-400" : "text-gray-300"} 
        />
      ))}
    </div>
  );
}
