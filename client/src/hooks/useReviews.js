import { useState, useEffect } from "react";

export const useReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API}reviews/product/${productId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch reviews");

        setReviews(data.reviews || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  return { reviews, loading, error };
};
