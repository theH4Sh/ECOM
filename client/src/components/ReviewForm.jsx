import StarRating from "./StarRating";
import { useState } from "react";

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0 || comment.trim() === "") return;

    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-400 rounded-xl p-6 space-y-5"
    >
      <h3 className="text-xl font-semibold">Write a Review</h3>

      {/* Rating */}
      <div>
        <label className="block font-medium mb-2">Rating</label>
        <StarRating rating={rating} setRating={setRating} />
      </div>

      {/* Comment */}
      <div>
        <label className="block font-medium mb-2">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-white focus:ring-[#0B7C56]"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={rating === 0 || comment.trim() === ""}
          className="bg-[#0B7C56] text-white px-6 py-2 rounded-lg font-semibold
                     hover:bg-[#095c40] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
}
