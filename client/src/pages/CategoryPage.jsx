import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useFetch } from "../hooks/useFetch";
import Card from "../components/Card";
import SkeletonCard from "../components/SkeletonCard";

const LIMIT = 8;

const CategoryPage = () => {
  const { category } = useParams();
  const [page, setPage] = useState(1);

  const { data: products, loading, error } = useFetch(import.meta.env.VITE_API + `product?category=${category}&page=${page}&limit=${LIMIT}`)

  if (loading) return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
  );
  if (error) return <p className="text-red-500 text-center mt-10">Failed to load products</p>;

  return (
    <div className="space-y-8 px-4 md:px-8">
      <h1 className="text-2xl font-bold capitalize">{category} Products</h1>

      {/* Products grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
            <Link to={`/product/${product._id}`} key={product._id}>
              <Card
                image={product.image}
                name={product.name}
                description={product.description}
                price={product.price}
                productId={product._id}
                averageRating={product.averageRating}
                reviewCount={product.reviewCount}
              />
            </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="font-semibold">Page {page}</span>
        <button
          disabled={products.length < LIMIT}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoryPage;
