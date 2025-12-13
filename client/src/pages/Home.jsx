import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useFetch } from "../hooks/useFetch";

const LIMIT = 10;

const Home = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const url = `http://localhost:8000/api/product?page=${page}&limit=${LIMIT}`;
  const { data, loading, error } = useFetch(url);

  if (data) {
    console.log(data)
  }

  // frontend search filter (since backend doesn't support it yet)
  const filteredProducts = data?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-14">

      {/* SEARCH / HERO */}
      <div className="bg-gray-100 rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Discover Your Style
        </h1>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B7C56]"
        />
      </div>

      {/* CATEGORIES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { name: "Men", image: "/men.jpg" },
          { name: "Women", image: "/women.jpg" },
          { name: "Kids", image: "/kids.jpg" },
        ].map((cat) => (
          <div
            key={cat.name}
            className="relative rounded-xl overflow-hidden cursor-pointer group"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="h-48 w-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h2 className="text-white text-2xl font-bold">{cat.name}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Products
        </h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error.message}</p>}

        {filteredProducts?.length === 0 && (
          <p className="text-gray-500">No products found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts?.map((product) => (
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
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-semibold text-gray-700">
          Page {page}
        </span>

        <button
          disabled={!data || data.length < LIMIT}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
