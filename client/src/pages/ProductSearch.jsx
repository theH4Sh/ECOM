import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import SkeletonCard from "../components/SkeletonCard";
import SearchBar from "../components/SearchBar";
import { parseApiError } from "../lib/api";

const LIMIT = 8;

export default function ProductSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasSearchCriteria = Boolean(q.trim() || category);

  useEffect(() => {
    if (!hasSearchCriteria) {
      setProducts([]);
      setPagination({
        page: 1,
        limit: LIMIT,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
      setError(null);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (category) params.set("category", category);
        params.set("page", String(page));
        params.set("limit", String(LIMIT));

        const res = await fetch(
          `${import.meta.env.VITE_API}product/search?${params.toString()}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw await parseApiError(res, "Failed to fetch products");

        const data = await res.json();
        const nextPagination = data.pagination || {
          page,
          limit: LIMIT,
          total: data.products?.length || 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: page > 1,
        };

        if (
          data.products?.length === 0 &&
          page > 1 &&
          nextPagination.totalPages >= 1
        ) {
          const params = new URLSearchParams();
          if (q) params.set("q", q);
          if (category) params.set("category", category);
          params.set("page", String(Math.max(1, nextPagination.totalPages)));
          setSearchParams(params);
          return;
        }

        setProducts(data.products || []);
        setPagination(nextPagination);
      } catch (err) {
        setError(err.message || "Something went wrong while fetching products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [q, category, page, hasSearchCriteria, setSearchParams]);

  const goToPage = (nextPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(nextPage));
    navigate(`/search?${params.toString()}`);
  };

  const clearCategoryFilter = () => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    params.set("page", "1");
    navigate(`/search?${params.toString()}`);
  };

  const clearSearch = () => {
    navigate("/search");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
      <section className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 p-6 md:p-8 space-y-6 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Search Products
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Browse by keyword, description, or category.
          </p>
        </div>

        <div className="flex justify-center w-full">
          <SearchBar defaultQuery={q} defaultCategory={category} />
        </div>
      </section>

      {!hasSearchCriteria && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0B7C56]/10 text-[#0B7C56]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-7 w-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Start with a search
          </h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Enter a product name or pick a category to see matching items.
          </p>
        </div>
      )}

      {hasSearchCriteria && (
        <>
          {category && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              <button
                type="button"
                onClick={clearCategoryFilter}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0B7C56]/10 px-3 py-1.5 text-sm font-medium text-[#0B7C56] hover:bg-[#0B7C56]/15 transition"
              >
                <span className="capitalize">{category}</span>
                <span aria-hidden="true">×</span>
              </button>
              <button
                type="button"
                onClick={clearCategoryFilter}
                className="text-sm text-gray-500 hover:text-gray-800 transition"
              >
                Clear filters
              </button>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {loading
                ? "Searching..."
                : q
                ? `Results for "${q}"`
                : `${category.charAt(0).toUpperCase()}${category.slice(1)} products`}
            </h2>
            {!loading && (
              <p className="mt-1 text-sm text-gray-500">
                {pagination.total === 0
                  ? "No products found"
                  : `${pagination.total} product${pagination.total === 1 ? "" : "s"} found`}
                {category && q && (
                  <>
                    {" "}
                    in <span className="capitalize text-gray-700">{category}</span>
                  </>
                )}
              </p>
            )}
          </div>

          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: LIMIT }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-8 text-center text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Nothing matched your search
              </h3>
              <p className="mt-2 text-gray-500">
                Try a different keyword or remove some filters.
              </p>
              <button
                type="button"
                onClick={clearSearch}
                className="mt-5 px-5 py-2.5 rounded-lg bg-[#0B7C56] text-white text-sm font-medium hover:bg-[#095c40] transition"
              >
                Clear search
              </button>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
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

              {pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button
                    type="button"
                    disabled={!pagination.hasPrevPage}
                    onClick={() => goToPage(page - 1)}
                    className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-gray-600">
                    Page <span className="font-semibold text-gray-900">{pagination.page}</span> of{" "}
                    <span className="font-semibold text-gray-900">{pagination.totalPages}</span>
                  </span>

                  <button
                    type="button"
                    disabled={!pagination.hasNextPage}
                    onClick={() => goToPage(page + 1)}
                    className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
