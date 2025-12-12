import { useState } from "react";
import { useSelector } from "react-redux";

export const usePostReview = (productId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const token = useSelector((state) => state.auth.token);

  const sendReview = async ({ rating, comment }) => {
    if (!token) throw new Error("You must be logged in to submit a review");
    if (!productId) throw new Error("Product ID is required");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API}reviews/product/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Failed to submit review");

      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { sendReview, loading, error, data };
};
