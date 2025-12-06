import { useState } from "react";
import { useSelector } from "react-redux";

export const usePostOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const token = useSelector(state => state.auth.token); // just get the token

  const sendOrder = async (items) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(import.meta.env.VITE_API + "order/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ items })
      });

      if (!response.ok) throw new Error("Failed to place order");

      const result = await response.json();
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { sendOrder, loading, error, data };
};
