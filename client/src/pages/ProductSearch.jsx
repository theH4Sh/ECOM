import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Card from "../components/Card";

export default function ProductSearch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (category) params.append("category", category);
      params.append("page", page);
      params.append("limit", 8);
      params.append("_ts", Date.now()); // prevent caching

      const res = await fetch(
        `http://localhost:8000/api/product/search?${params.toString()}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProducts(data);
      console.log("Fetched products:", data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [q, category, page]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        Search Results {q && `for "${q}"`}
      </h2>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500">No products found</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="cursor-pointer"
          >
            <Card
              image={product.image}
              name={product.name}
              description={product.description}
              price={product.price}
              averageRating={product.averageRating}
              reviewCount={product.reviewCount}
            />
          </div>
        ))}
      </div>

      {products.length > 0 && (
        <div className="flex justify-center items-center gap-6 mt-10">
          <PageButton page={page - 1} disabled={page === 1} />
          <span className="font-semibold">Page {page}</span>
          <PageButton page={page + 1} />
        </div>
      )}
    </div>
  );
}

function PageButton({ page, disabled }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const goToPage = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <button
      disabled={disabled}
      onClick={goToPage}
      className="px-5 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40"
    >
      {disabled ? "Prev" : page > Number(searchParams.get("page") || 1) ? "Next" : "Prev"}
    </button>
  );
}
