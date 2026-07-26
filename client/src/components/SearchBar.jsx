import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({
  defaultQuery = "",
  defaultCategory = "",
}) {
  const [query, setQuery] = useState(defaultQuery);
  const [category, setCategory] = useState(defaultCategory);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(defaultQuery);
    setCategory(defaultCategory);
  }, [defaultQuery, defaultCategory]);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    const trimmedQuery = query.trim();

    if (trimmedQuery) params.append("q", trimmedQuery);
    if (category) params.append("category", category);
    params.set("page", "1");

    navigate(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-2xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-3 sm:rounded-full sm:px-4 sm:py-2"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <svg
          className="h-5 w-5 shrink-0 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m1.6-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none sm:w-auto sm:rounded-none sm:border-0 sm:border-l sm:bg-transparent sm:py-1 sm:pl-3 sm:pr-2"
        >
          <option value="">All categories</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>

        <button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-[#0B7C56] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#0A6B4A] sm:w-auto sm:rounded-full sm:py-2"
        >
          Search
        </button>
      </div>
    </form>
  );
}
