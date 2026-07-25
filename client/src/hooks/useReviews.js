import { useCallback, useState, useEffect } from "react";
import { getErrorMessage } from "../lib/api";

export const useReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API}reviews/product/${productId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(getErrorMessage(data, "Failed to fetch reviews"));
      }

      setReviews(data.reviews || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReview = useCallback((review) => {
    setReviews((prev) => [review, ...prev]);
  }, []);

  const removeReview = useCallback((reviewId) => {
    setReviews((prev) => prev.filter((review) => review._id !== reviewId));
  }, []);

  return { reviews, loading, error, addReview, removeReview, refetch: fetchReviews };
};
