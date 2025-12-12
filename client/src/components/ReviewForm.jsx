import StarRating from "./StarRating";
import { useState } from "react";

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col text-start max-w-xl">

      <div>
        <label className="block font-semibold mb-1">Rating</label>
        <StarRating rating={rating} setRating={setRating} />
      </div>

      <div>
        <label className="block font-semibold mb-1">Comment</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-[#0B7C56] cursor-pointer text-white px-4 py-2 rounded font-semibold hover:bg-[#095c40] transition-colors"
      >
        Submit Review
      </button>
    </form>
  );
}
